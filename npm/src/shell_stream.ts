import * as denoShim from "deno.ns";
import { log, LogTransformFunction } from "./operators/log.js";
import { toFile } from "./endpoints/to_file.js";
import { run, RunOptions } from "./operators/run.js";
import { grep } from "./operators/grep.js";
import { timestamp } from "./operators/timestamp.js";
import { tap, TapFunction } from "./operators/tap.js";
import { replace, Replacer } from "./operators/replace.js";
import { map, MapFunction } from "./operators/map.js";
import { filter, FilterFunction } from "./operators/filter.js";
import { cut } from "./operators/cut.js";
import { Generator, OperatorFunc } from "./types.js";
import { close, CloseOptions } from "./endpoints/close.js";
import { toString } from "./endpoints/to_string.js";
import { toArray } from "./endpoints/to_array.js";
import { pipe } from "./operators/pipe.js";
import { tee } from "./operators/tee.js";
import { from } from "./startpoints/from.js";
import { fromFile, FromFileOpt } from "./startpoints/from_file.js";
import { fromArray } from "./startpoints/from_array.js";
import { fromRun } from "./startpoints/from_run.js";
import { fromString } from "./startpoints/from_string.js";
import { tail } from "./operators/tail.js";
import { head } from "./operators/head.js";
import { logWithTimestamp } from "./operators/logWithTimestamp.js";
import { success } from "./endpoints/success.js";
import { sponge } from "./operators/sponge.js";
import { fromDir } from "./startpoints/from_dir.js";
import { fromWalk } from "./startpoints/from_walk.js";
import { WalkOptions } from "./deps.js";
import { sort } from "./operators/sort.js";
import { uniq } from "./operators/uniq.js";
import { toIterable } from "./endpoints/to_iterable.js";

export class ShellStream {
  process?: denoShim.Deno.Process;
  processStatus?: denoShim.Deno.ProcessStatus;
  processCmd?: string[];
  file?: denoShim.Deno.File;

  private constructor(
    public parents: ShellStream[],
    public generator: Generator,
  ) {}

  run = (cmd: string[] | string, opt?: RunOptions): ShellStream =>
    run(cmd, opt)(this);
  toFile = (outputPath: string) => toFile(outputPath)(this);
  tee = (outputPath: string) => tee(outputPath)(this);
  log = (transform?: LogTransformFunction) => log(transform)(this);
  logWithTimestamp = () => logWithTimestamp()(this);
  grep = (regex: RegExp) => grep(regex)(this);
  timestamp = () => timestamp()(this);
  tap = (tapFunction: TapFunction) => tap(tapFunction)(this);
  replace = (v: string | RegExp, r: Replacer) => replace(v, r)(this);
  map = (mapFunction: MapFunction) => map(mapFunction)(this);
  filter = (filterFunction: FilterFunction) => filter(filterFunction)(this);
  cut = (delim: string, i: number[], sep = " ") => cut(delim, i, sep)(this);
  head = (count = 1) => head(count)(this);
  tail = (count = 1) => tail(count)(this);
  sponge = () => sponge()(this);
  sort = () => sort()(this);
  uniq = () => uniq()(this);

  pipe = (...operators: OperatorFunc[]) => pipe(...operators)(this);

  // EndOperators
  close = async (opt: CloseOptions = { processes: "AWAIT" }) =>
    await close(opt)(this);
  toString = async () => await toString()(this);
  toArray = async () => await toArray()(this);
  toIterable = () => toIterable()(this);
  success = async () => await success()(this);

  static builder(generator: Generator, inputStream?: ShellStream): ShellStream {
    return new ShellStream(
      inputStream ? [...inputStream.parents, inputStream] : [],
      generator,
    );
  }
  static empty(): ShellStream {
    const emptyGenerator: Generator = (async function* () {})();
    return new ShellStream([], emptyGenerator);
  }

  static from = (iterable: AsyncIterable<string> | Iterable<string>) =>
    from(iterable)();
  static fromFile = (path: string, opt?: FromFileOpt) => fromFile(path, opt)();
  static fromDir = (path: string) => fromDir(path)();
  static fromWalk = (path: string, opt?: WalkOptions) => fromWalk(path, opt)();
  static fromArray = (lines: string[]) => fromArray(lines)();
  static fromString = (line: string) => fromString(line)();
  static fromRun = (cmd: string[] | string, opt?: RunOptions) =>
    fromRun(cmd, opt)();
  static pipe = (...op: OperatorFunc[]) => pipe(...op)(ShellStream.empty());

  static processCount = 0;
  static processDone = 0;
  static processEventListener: ProcessEventListener[] = [];
  static subscribeProcessEvent(listener: ProcessEventListener) {
    ShellStream.processEventListener.push(listener);
  }
  static unsubscribeProcessEvent(listener: ProcessEventListener) {
    ShellStream.processEventListener = ShellStream.processEventListener.filter(
      (l) => l !== listener,
    );
  }
  static sendProcessEvent() {
    ShellStream.processEventListener.forEach((listener: ProcessEventListener) =>
      listener({
        processCount: ShellStream.processCount,
        processDone: ShellStream.processDone,
      })
    );
  }
  static incProcessCount() {
    ShellStream.processCount++;
    ShellStream.sendProcessEvent();
  }
  static incProcessDone() {
    ShellStream.processDone++;
    ShellStream.sendProcessEvent();
  }
}
export type ProcessEvent = { processCount: number; processDone: number };
export type ProcessEventListener = (event: ProcessEvent) => unknown;

export const Pipe = ShellStream.pipe;
export const From = ShellStream.from;
export const FromFile = ShellStream.fromFile;
export const FromDir = ShellStream.fromDir;
export const FromWalk = ShellStream.fromWalk;
export const FromRun = ShellStream.fromRun;
export const FromArray = ShellStream.fromArray;
export const FromString = ShellStream.fromString;
