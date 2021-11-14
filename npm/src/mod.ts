import { fromString } from "./startpoints/from_string.js";
import { from } from "./startpoints/from.js";

export {
  From,
  FromArray,
  FromDir,
  FromFile,
  FromRun,
  FromString,
  FromWalk,
  Pipe,
  ShellStream,
} from "./shell_stream.js";

export { from } from "./startpoints/from.js";
export { fromArray } from "./startpoints/from_array.js";
export { fromRun } from "./startpoints/from_run.js";
export { fromFile } from "./startpoints/from_file.js";
export { fromDir } from "./startpoints/from_dir.js";
export { fromWalk } from "./startpoints/from_walk.js";
export { fromString } from "./startpoints/from_string.js";

export { cut } from "./operators/cut.js";
export { filter } from "./operators/filter.js";
export { grep } from "./operators/grep.js";
export { log } from "./operators/log.js";
export { map } from "./operators/map.js";
export { pipe } from "./operators/pipe.js";
export { replace } from "./operators/replace.js";
export { closeProcess, parseCmdString, run } from "./operators/run.js";
export { sort } from "./operators/sort.js";
export { sponge } from "./operators/sponge.js";
export { tap } from "./operators/tap.js";
export { tee } from "./operators/tee.js";
export { timestamp } from "./operators/timestamp.js";
export { uniq } from "./operators/uniq.js";

export { close } from "./endpoints/close.js";
export { success } from "./endpoints/success.js";
export { toArray } from "./endpoints/to_array.js";
export { toFile } from "./endpoints/to_file.js";
export { toString } from "./endpoints/to_string.js";

export { sanitize } from "./sanitize.js";

export type { OperatorFunc } from "./types.js";
export type { RunOptions } from "./operators/run.js";
export type { ProcessEvent, ProcessEventListener } from "./shell_stream.js";
