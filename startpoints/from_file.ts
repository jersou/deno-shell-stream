import { ShellStream } from "../shell_stream.ts";
import { readLines } from "../deps.ts";
import { StartOperator } from "../types.ts";

export const fromFile: StartOperator = (path: string) =>
  () => {
    const generator = (async function* () {
      const file = await Deno.open(path);
      for await (const line of readLines(file)) {
        yield line;
      }
      file.close();
    })();
    return ShellStream.builder(generator);
  };
