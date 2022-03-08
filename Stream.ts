import { RunOptions, RunStream } from "./run/RunStream.ts";
import { arrayToStream } from "./utils/ArrayToStream.ts";
import { FileStream } from "./file/FileStream.ts";
import { LineStream } from "./line/LineStream.ts";
import { dirToStream } from "./utils/dirToStream.ts";
import { walkToStream } from "./utils/walkToStream.ts";
import { WalkEntry, WalkOptions } from "./deps.ts";
import { promiseToStream } from "./utils/PromiseToStream.ts";

// TODO doc readme AND in *.ts

export abstract class Stream {
  static fromRun(cmdOrStr: string[] | string, opt?: RunOptions): RunStream {
    return new RunStream(cmdOrStr, opt);
  }

  static fromFile(file: Deno.FsFile | string): FileStream {
    return new FileStream(file);
  }

  static fromArray<T>(array: T[]): LineStream<T> {
    return new LineStream(undefined, arrayToStream(array));
  }

  static fromString(str: string): LineStream<string> {
    return new LineStream(undefined, arrayToStream(str.split("\n")));
  }

  static fromDir(path: string): LineStream<Deno.DirEntry> {
    return new LineStream(undefined, dirToStream(path));
  }

  static fromWalk(path: string, opt?: WalkOptions): LineStream<WalkEntry> {
    return new LineStream(undefined, walkToStream(path, opt));
  }

  static fromFetch(url: string): LineStream<string> {
    return new LineStream(
      undefined,
      promiseToStream(
        fetch(url).then((r) => r.body!.pipeThrough(new TextDecoderStream())),
      ),
    );
  }

  // region ---------------- verbose ---------------
  static verbose = false;
  static setVerbose(verb: boolean) {
    Stream.verbose = verb;
  }
  // endregion ---------------- verbose ---------------

  // region ---------------- process Event Listener ---------------
  static processCount = 0;
  static processDone = 0;
  static processEventListener: ProcessEventListener[] = [];
  static subscribeProcessEvent(listener: ProcessEventListener) {
    Stream.processEventListener.push(listener);
  }
  static unsubscribeProcessEvent(listener: ProcessEventListener) {
    Stream.processEventListener = Stream.processEventListener.filter(
      (l) => l !== listener,
    );
  }
  static sendProcessEvent() {
    Stream.processEventListener.forEach((listener: ProcessEventListener) =>
      listener({
        processCount: Stream.processCount,
        processDone: Stream.processDone,
      })
    );
  }
  static incProcessCount() {
    Stream.processCount++;
    Stream.sendProcessEvent();
  }
  static incProcessDone() {
    Stream.processDone++;
    Stream.sendProcessEvent();
  }
  // endregion ---------------- process Event Listener ---------------

  // region ---------------- cwd ---------------
  static cwd?: string;
  static setCwd(newCwd: string) {
    Stream.cwd = newCwd;
  }
  static getCwd() {
    return Stream.cwd;
  }
  // endregion ---------------- cwd ---------------
}
export type ProcessEvent = { processCount: number; processDone: number };
export type ProcessEventListener = (event: ProcessEvent) => unknown;

// aliases
export const setCwd = Stream.setCwd;
export const run = Stream.fromRun;
export const read = Stream.fromFile;
export function waitRun(cmdOrStr: string[] | string, opt?: RunOptions) {
  return Stream.fromRun(cmdOrStr, opt).wait();
}
export function runOk(cmdOrStr: string[] | string, opt?: RunOptions) {
  return Stream.fromRun(cmdOrStr, opt).success();
}
export function runKo(cmdOrStr: string[] | string, opt?: RunOptions) {
  return Stream.fromRun(cmdOrStr, opt).fail();
}
export function runToString(cmdOrStr: string[] | string, opt?: RunOptions) {
  return Stream.fromRun(cmdOrStr, opt).toString();
}
