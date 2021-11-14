import { ShellStream } from "../shell_stream.js";
import { StartOperator } from "../types.js";
import { walk, WalkOptions } from "../deps.js";

export const fromWalk: StartOperator = (path: string, opt?: WalkOptions) =>
  () => {
    const generator = (async function* () {
      for await (const dirEntry of walk(path, opt)) {
        yield dirEntry.path;
      }
    })();
    return ShellStream.builder(generator);
  };
