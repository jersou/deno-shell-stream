import { parseCmdString } from "../utils/parseCmdString.ts";
import { LineStream } from "../line/LineStream.ts";
import { assert, TextLineStream } from "../deps.ts";
import { Stream } from "../Stream.ts";
import { RunError } from "./RunError.ts";

/**
 * Get the RunStream from a Stream, if it's an instance of RunStream.
 * @param {LineStream<unknown> | undefined} stream LineStream<unknown> |
 * undefined
 * @returns A RunStream if the input is an instance of RunStream, undefined
 * otherwise
 */
export function getRunStream(
  stream: LineStream<unknown> | undefined,
): RunStream | undefined {
  if (stream instanceof RunStream) {
    return stream;
  }
  return undefined;
}

export type RunOptions = Omit<Deno.RunOptions, "cmd"> & {
  allowFail?: boolean;
  exitCodeOnFail?: number;
};

/* LineStream that runs a process and output its stdout as LineStream */
export class RunStream extends LineStream<string> {
  /* the command of the process. */
  processCmd: string[];
  /* the Deno process. */
  process?: Deno.Process<Deno.RunOptions>;
  /* the exit status of the process */
  processStatus?: Deno.ProcessStatus;
  /* option used by the start() method */
  runningOpt?: { stdout: RunOptions["stdout"] };
  isClosed = false;
  /* The current working directory used by the process */
  cwd: string;

  /**
   @param {string[] | string} cmdOrStr A string or array of strings that
   represents the command to run.
   * @param {RunOptions | undefined} [opt] options
   * @param {LineStream<unknown> | undefined} [parent] The parent stream.
   */
  constructor(
    public cmdOrStr: string[] | string,
    public opt?: RunOptions | undefined,
    public parent?: LineStream<unknown> | undefined,
  ) {
    super(parent);
    this.processCmd = parseCmdString(cmdOrStr);
    this.cwd = Stream.getCwd() || Deno.cwd();
  }

  /**
   * convert the stdout to stream of lines
   * @returns A ReadableStream that emits each line of the process stdout
   */
  getLineReadableStream(): ReadableStream<string> {
    if (!this.linesStream) {
      this.linesStream = this
        .toByteReadableStream()
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new TextLineStream());
    }
    return this.linesStream!;
  }

  /**
   * If the process is not running, start it. If the stream has child, the
   * stdout run option is set to "piped"
   * @param [opt] { stdout: RunOptions["stdout"] }
   * @returns The stream itself.
   */
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

  /**
   * @returns A promise of the stdout process as string
   */
  async toString() {
    return new TextDecoder().decode(await this.toBytes());
  }

  /**
   * @returns A promise of the stdout process as Uint8Array
   */
  async toBytes() {
    this.start({ stdout: "piped" });
    const ret = await this.process!.output();
    await this.wait();
    return ret;
  }

  /**
   * wait for the parent to finish and wait the end of the process
   * @param [opt]{ checkSuccess?: boolean }
   * @returns itself.
   */
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
            throw new RunError(
              `Fail, process exit code : ${this.processStatus?.code}`,
              this,
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

  /**
   * @returns the stdout readable of the process
   */
  toByteReadableStream(): ReadableStream<Uint8Array> {
    this.start({ stdout: "piped" });
    return this.process!.stdout!.readable;
  }

  /**
   * Save the stdout of the process in the file
   * @param {Deno.FsFile | string} file file to write
   * @returns promise of itself.
   */
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
