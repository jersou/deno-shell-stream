import { fromString } from "./startpoints/from_string.ts";
import { from } from "./startpoints/from.ts";

export {
  FromArray,
  FromFile,
  FromRun,
  FromString,
  Pipe,
  ShellStream,
} from "./shell_stream.ts";

export { from } from "./startpoints/from.ts";
export { fromArray } from "./startpoints/from_array.ts";
export { fromRun } from "./startpoints/from_run.ts";
export { fromFile } from "./startpoints/from_file.ts";
export { fromString } from "./startpoints/from_string.ts";

export { cut } from "./operators/cut.ts";
export { filter } from "./operators/filter.ts";
export { grep } from "./operators/grep.ts";
export { log } from "./operators/log.ts";
export { map } from "./operators/map.ts";
export { pipe } from "./operators/pipe.ts";
export { replace } from "./operators/replace.ts";
export { closeProcess, parseCmdString, run } from "./operators/run.ts";
export { sponge } from "./operators/sponge.ts";
export { tap } from "./operators/tap.ts";
export { tee } from "./operators/tee.ts";
export { timestamp } from "./operators/timestamp.ts";

export { close } from "./endpoints/close.ts";
export { success } from "./endpoints/success.ts";
export { toArray } from "./endpoints/to_array.ts";
export { toFile } from "./endpoints/to_file.ts";
export { toString } from "./endpoints/to_string.ts";

export { sanitize } from "./sanitize.ts";

export type { OperatorFunc } from "./types.ts";
export type { RunOptions } from "./operators/run.ts";
export type { ProcessEvent, ProcessEventListener } from "./shell_stream.ts";
