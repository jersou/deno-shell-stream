import { log, LogTransformFunction } from "./operators/log.ts";
import { toFile } from "./endpoints/to_file.ts";
import { run, RunOptions } from "./operators/run.ts";
import { grep } from "./operators/grep.ts";
import { timestamp } from "./operators/timestamp.ts";
import { tap, TapFunction } from "./operators/tap.ts";
import { replace, Replacer } from "./operators/replace.ts";
import { map, MapFunction } from "./operators/map.ts";
import { filter, FilterFunction } from "./operators/filter.ts";
import { cut } from "./operators/cut.ts";
import { Generator, OperatorFunc, StartOperatorFunc } from "./types.ts";
import { close, CloseOptions } from "./endpoints/close.ts";
import { toString } from "./endpoints/to_string.ts";
import { toArray } from "./endpoints/to_array.ts";
import { pipe } from "./operators/pipe.ts";
import { tee } from "./operators/tee.ts";
import { fromFile } from "./startpoints/from_file.ts";
import { fromArray } from "./startpoints/from_array.ts";
import { fromRun } from "./startpoints/from_run.ts";
import { tail } from "./operators/tail.ts";
import { head } from "./operators/head.ts";
import { logWithTimestamp } from "./operators/logWithTimestamp.ts";

export class ShellStream {
  process?: Deno.Process;
  processStatus?: Deno.ProcessStatus;
  processCmd?: string[];
  file?: Deno.File;

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

  pipe = (
    start: StartOperatorFunc | OperatorFunc,
    ...operators: OperatorFunc[]
  ) => pipe(start, ...operators)(this);

  // EndOperators
  close = async (opt: CloseOptions = { processes: "AWAIT" }) =>
    await close(opt)(this);
  toString = async () => await toString()(this);
  toArray = async () => await toArray()(this);

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
  static fromFile = (path: string) => fromFile(path)();
  static fromArray = (lines: string[]) => fromArray(lines)();
  static fromRun = (cmd: string[] | string, opt?: RunOptions) =>
    fromRun(cmd, opt)();
  static pipe = (...op: OperatorFunc[]) => pipe(...op)(ShellStream.empty());
}

export const Pipe = ShellStream.pipe;
export const FromFile = ShellStream.fromFile;
export const FromRun = ShellStream.fromRun;
export const FromArray = ShellStream.fromArray;
