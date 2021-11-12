import * as denoShim from "deno.ns";
import { ShellStream } from "../shell_stream.js";
import { readLines } from "../deps.js";
import { StartOperator } from "../types.js";

export type FromFileOpt = { closeBeforeStreaming?: boolean };
export const fromFile: StartOperator = (path: string, opt?: FromFileOpt) =>
  () => {
    const generator = (async function* () {
      if (opt?.closeBeforeStreaming) {
        const fileContent = await denoShim.Deno.readTextFile(path);
        for await (const line of fileContent.split("\n")) {
          yield line;
        }
      } else {
        const file = await denoShim.Deno.open(path);
        for await (const line of readLines(file)) {
          yield line;
        }
        file.close();
      }
    })();
    return ShellStream.builder(generator);
  };
