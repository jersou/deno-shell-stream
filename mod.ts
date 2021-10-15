export {
  FromArray,
  FromFile,
  FromRun,
  Pipe,
  ShellStream,
} from "./shell_stream.ts";

export { fromArray } from "./startpoints/from_array.ts";
export { fromRun } from "./startpoints/from_run.ts";

export { cut } from "./operators/cut.ts";
export { filter } from "./operators/filter.ts";
export { grep } from "./operators/grep.ts";
export { log } from "./operators/log.ts";
export { map } from "./operators/map.ts";
export { pipe } from "./operators/pipe.ts";
export { replace } from "./operators/replace.ts";
export { closeProcess, parseCmdString, run } from "./operators/run.ts";
export { tap } from "./operators/tap.ts";
export { tee } from "./operators/tee.ts";
export { timestamp } from "./operators/timestamp.ts";

export { toArray } from "./endpoints/to_array.ts";
export { toFile } from "./endpoints/to_file.ts";
export { toString } from "./endpoints/to_string.ts";
export { close } from "./endpoints/close.ts";

export type { OperatorFunc } from "./types.ts";
export type { RunOptions } from "./operators/run.ts";
