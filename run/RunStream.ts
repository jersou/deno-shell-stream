import { assert } from "../test_deps.ts";
import { parseCmdString } from "../utils/parseCmdString.ts";
import { LineStream } from "../line/LineStream.ts";
import {
  TextLineStream,
} from "https://deno.land/std@0.128.0/streams/delimiter.ts";

export function getParentRun(stream: LineStream<unknown> | undefined) {
  if (stream?.parent instanceof RunStream) {
    return stream.parent;
  }
  return undefined;
}

export type RunOptions = Omit<Deno.RunOptions, "cmd"> & {
  dontThrowIfRunFail?: boolean;
  dontThrowIfStdinError?: boolean;
};

export class RunStream extends LineStream<string> {
  processCmd: string[];
  process?: Deno.Process<Deno.RunOptions>;
  processStatus?: Deno.ProcessStatus;
  stdinError?: Error;
  runningOpt?: { stdout: RunOptions["stdout"] };

  constructor(
    public cmdOrStr: string[] | string,
    public opt?: RunOptions | undefined,
    public parent?: LineStream<unknown> | undefined,
  ) {
    super(parent);
    this.processCmd = parseCmdString(cmdOrStr);
  }

  getLineReadableStream(): ReadableStream<string> {
    if (!this.linesStream) {
      this.linesStream = this.toStringReadableStream().pipeThrough(
        new TextLineStream(),
      );
    }
    return this.linesStream!;
  }

  start(opt?: { stdout: RunOptions["stdout"] }) {
    if (!this.process) {
      this.runningOpt = opt;
      if (this.parent) {
        const parentStream = this.parent.toByteReadableStream(); // if this.parentRunStream → this.parentRunStream.opt.stdout==="piped"

        if (this.parent instanceof RunStream) {
          assert(
            this.parent.runningOpt?.stdout === "piped" ||
              this.parent.opt?.stdout === "piped",
            `The parent stream "${this.parent.cmdOrStr}" does not have the option : stdout="piped"`,
          );
        }

        this.process = Deno.run({
          cmd: this.processCmd,
          ...this.opt,
          ...opt,
          stdin: "piped",
        });

        parentStream.pipeTo(this.process.stdin!.writable).catch(
          (err: Error) => (this.stdinError = err),
        );
      } else {
        this.process = Deno.run({
          cmd: this.processCmd,
          ...this.opt,
          ...opt,
        });
      }
    } else if (opt) {
      assert(
        this.runningOpt?.stdout === "piped",
        `Already running and the opt param is not empty. Use start({ stdout: "piped" })`,
      );
    }
    return this;
  }

  async toString() {
    return new TextDecoder().decode(await this.toBytes());
  }

  async toBytes() {
    this.start({ stdout: "piped" });
    const ret = await this.process!.output();
    await this.wait();
    return ret;
  }

  async wait(): Promise<this> {
    this.start();
    await this.parent?.wait();
    if (!this.processStatus) {
      this.processStatus = await this.process!.status();
    }

    this.process!.close();

    if (!this.opt?.dontThrowIfStdinError && this.stdinError) {
      console.error(this.stdinError);
      throw new Error("Stdin error");
    }
    if (!this.opt?.dontThrowIfRunFail && !this.processStatus?.success) {
      throw new Error(
        `Fail, process exit code : ${this.processStatus?.code}`,
      );
    }
    return this;
  }

  toByteReadableStream(): ReadableStream<Uint8Array> {
    this.start({ stdout: "piped" });
    return this.process!.stdout!.readable;
  }

  toStringReadableStream() {
    return this
      .toByteReadableStream()
      .pipeThrough(new TextDecoderStream());
  }

  run(cmdOrStr: string[] | string, opt: RunOptions = {}) {
    return new RunStream(cmdOrStr, opt, this);
  }

  async toFile(file: Deno.FsFile | string) {
    let fsFile;
    if (typeof file === "string") {
      fsFile = await Deno.create(file);
    } else {
      fsFile = file;
    }
    await this.toByteReadableStream().pipeTo(fsFile.writable);
    await this.wait();
  }
}
