import { parseCmdString } from "../utils/parseCmdString.ts";
import { LineStream } from "../line/LineStream.ts";
import { assert, TextLineStream } from "../deps.ts";

export function getParentRun(stream: LineStream<unknown> | undefined) {
  if (stream?.parent instanceof RunStream) {
    return stream.parent;
  }
  return undefined;
}

export type RunOptions = Omit<Deno.RunOptions, "cmd"> & {
  dontThrowIfRunFail?: boolean;
  exitCodeIfRunFail?: number;
};

export class RunStream extends LineStream<string> {
  processCmd: string[];
  process?: Deno.Process<Deno.RunOptions>;
  processStatus?: Deno.ProcessStatus;
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

        this.process = Deno.run({
          cmd: this.processCmd,
          ...this.opt,
          ...opt,
          stdin: "piped",
        });

        parentStream.pipeTo(this.process.stdin!.writable);
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

    if (!this.processStatus?.success) {
      if (this.opt?.exitCodeIfRunFail !== undefined) {
        Deno.exit(this.opt?.exitCodeIfRunFail);
      }
      if (!this.opt?.dontThrowIfRunFail) {
        throw new Error(
          `Fail, process exit code : ${this.processStatus?.code}`,
        );
      }
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
