import { parseCmdString } from "../utils/parseCmdString.ts";
import { LineStream } from "../line/LineStream.ts";
import { assert, TextLineStream } from "../deps.ts";
import { Stream } from "../Stream.ts";

export function getRunStream(
  stream: LineStream<unknown> | undefined,
): RunStream | undefined {
  if (stream instanceof RunStream) {
    return stream;
  }
  return undefined;
}
export function getParentRun(stream: LineStream<unknown> | undefined) {
  return getRunStream(stream?.parent);
}

export type RunOptions = Omit<Deno.RunOptions, "cmd"> & {
  allowFail?: boolean;
  exitCodeOnFail?: number;
};

export class RunStream extends LineStream<string> {
  processCmd: string[];
  process?: Deno.Process<Deno.RunOptions>;
  processStatus?: Deno.ProcessStatus;
  runningOpt?: { stdout: RunOptions["stdout"] };
  isClosed = false;
  cwd: string;

  constructor(
    public cmdOrStr: string[] | string,
    public opt?: RunOptions | undefined,
    public parent?: LineStream<unknown> | undefined,
  ) {
    super(parent);
    this.processCmd = parseCmdString(cmdOrStr);
    this.cwd = Stream.getCwd() || Deno.cwd();
  }

  getLineReadableStream(): ReadableStream<string> {
    if (!this.linesStream) {
      this.linesStream = this
        .toByteReadableStream()
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new TextLineStream());
    }
    return this.linesStream!;
  }

  start(opt?: { stdout: RunOptions["stdout"] }) {
    if (!this.process) {
      this.runningOpt = opt;
      if (this.parent) {
        const parentStream = this.parent.toByteReadableStream(); // if this.parentRunStream → this.parentRunStream.opt.stdout==="piped"
        Stream.incProcessCount();
        const fullOpt: Deno.RunOptions = {
          cmd: this.processCmd,
          cwd: this.cwd,
          ...this.opt,
          ...opt,
          stdin: "piped",
        };
        if (Stream.verbose) {
          console.log("start processCmd: ", {
            processCmd: this.processCmd,
            opt: fullOpt,
          });
        }
        this.process = Deno.run(fullOpt);
        parentStream.pipeTo(this.process.stdin!.writable);
      } else {
        Stream.incProcessCount();
        const fullOpt: Deno.RunOptions = {
          cmd: this.processCmd,
          cwd: this.cwd,
          ...this.opt,
          ...opt,
        };
        if (Stream.verbose) {
          console.log("start processCmd: ", {
            processCmd: this.processCmd,
            opt: fullOpt,
          });
        }
        this.process = Deno.run(fullOpt);
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

  async wait(opt?: { checkSuccess?: boolean }): Promise<this> {
    if (!this.isClosed) {
      this.start();
      await this.parent?.wait(opt);
      if (!this.processStatus) {
        this.processStatus = await this.process!.status();
      }

      this.process!.close();
      Stream.incProcessDone();

      if (!this.processStatus?.success) {
        if (this.opt?.exitCodeOnFail !== undefined) {
          Deno.exit(this.opt?.exitCodeOnFail);
        }
        if (opt?.checkSuccess) {
          if (this.opt?.allowFail === false) {
            console.warn(
              "[RunStream] allowFail===false but checkSuccess is requested",
            );
            throw new Error(
              `Fail, process exit code : ${this.processStatus?.code}`,
            );
          }
        } else if (!this.opt?.allowFail) {
          throw new Error(
            `Fail, process exit code : ${this.processStatus?.code}`,
          );
        }
      }
      this.isClosed = true;
    }
    return this;
  }

  toByteReadableStream(): ReadableStream<Uint8Array> {
    this.start({ stdout: "piped" });
    return this.process!.stdout!.readable;
  }

  async toFile(file: Deno.FsFile | string) {
    let fsFile;
    if (typeof file === "string") {
      fsFile = await Deno.create(file);
    } else {
      fsFile = file;
    }
    await this.toByteReadableStream().pipeTo(fsFile.writable);
    return await this.wait();
  }
}
