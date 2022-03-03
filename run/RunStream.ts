import { RunStreamRunning } from "./RunStreamRunning.ts";
import { assert } from "../test_deps.ts";
import { TextLineStream } from "../deps.ts";
import { LineStream, TapFunction } from "../line/LineStream.ts";
import { parseCmdString } from "../utils/parseCmdString.ts";
import { MapFunction } from "../transform/MapTransform.ts";

export type RunOptions = Omit<Deno.RunOptions, "cmd"> & {
  dontThrowIfRunFail?: boolean;
  dontThrowIfStdinError?: boolean;
};

export class RunStream {
  processCmd: string[];
  running?: RunStreamRunning;
  lineStream?: LineStream;
  stdoutReadable?: ReadableStream<Uint8Array>;

  constructor(
    public cmdOrStr: string[] | string,
    public opt?: RunOptions,
    public parentRunStream?: RunStream,
  ) {
    this.processCmd = parseCmdString(cmdOrStr);
  }

  start(opt?: { stdout: RunOptions["stdout"] }) {
    if (!this.running) {
      this.running = new RunStreamRunning(
        this,
        opt,
      );
    } else if (opt) {
      assert(
        !this.running || this.running.opt?.stdout === "piped",
        `Already running and the opt param is not empty. Use start({ stdout: "piped" })`,
      );
    }
    return this.running;
  }

  outputBytes() {
    return this.start({ stdout: "piped" }).outputBytes();
  }

  outputString() {
    return this.start({ stdout: "piped" }).outputString();
  }

  async wait() {
    return await this.start().wait();
  }

  getStdoutReadable() {
    this.stdoutReadable = this.start({ stdout: "piped" })
      .process.stdout!.readable;
    return this.stdoutReadable;
  }

  stdoutStringReadableStream() {
    return this
      .getStdoutReadable()
      .pipeThrough(new TextDecoderStream());
  }

  stdoutLines(): ReadableStream<string> {
    return this.stdoutStringReadableStream().pipeThrough(new TextLineStream());
  }

  run(cmdOrStr: string[] | string, opt: RunOptions = {}) {
    return new RunStream(cmdOrStr, opt, this);
  }

  lines() {
    if (!this.lineStream) {
      this.lineStream = new LineStream(this, this.stdoutLines());
    }
    return this.lineStream;
  }

  transform(transformStream: TransformStream<string, string>) {
    return this.lines().transform(transformStream);
  }
  array() {
    return this.lines().array();
  }
  log() {
    return this.lines().log();
  }
  grep(regex: RegExp | string, opt?: { onlyMatching?: boolean }) {
    return this.lines().grep(regex, opt);
  }
  grepo(regex: RegExp | string) {
    return this.grep(regex, { onlyMatching: true });
  }
  map(mapFunction: MapFunction) {
    return this.lines().map(mapFunction);
  }
  tap(tapFunction: TapFunction) {
    return this.lines().tap(tapFunction);
  }
}
