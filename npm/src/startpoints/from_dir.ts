import * as denoShim from "deno.ns";
import { ShellStream } from "../shell_stream.js";
import { StartOperator } from "../types.js";

export const fromDir: StartOperator = (path: string) =>
  () => {
    const generator = (async function* () {
      for await (const dirEntry of denoShim.Deno.readDir(path)) {
        yield dirEntry.name;
      }
    })();
    return ShellStream.builder(generator);
  };
