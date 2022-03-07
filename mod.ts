import { Stream } from "./Stream.ts";

export { Stream } from "./Stream.ts";
export { LineStream } from "./line/LineStream.ts";
export { RunStream } from "./run/RunStream.ts";
export { FileStream } from "./file/FileStream.ts";
export { streamToArray } from "./utils/StreamToArray.ts";
export { arrayToStream } from "./utils/ArrayToStream.ts";
export { promiseToStream } from "./utils/PromiseToStream.ts";
export { parseCmdString } from "./utils/parseCmdString.ts";
export { checkOps, checkResources, sanitize } from "./utils/sanitize.ts";
export { getParentRun, getRunStream } from "./run/RunStream.ts";

export type { ProcessEvent, ProcessEventListener } from "./Stream.ts";

export const run = Stream.fromRun;
export const read = Stream.fromFile;
