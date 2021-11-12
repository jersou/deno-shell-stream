import { ShellStream } from "../shell_stream.js";
import { StartOperator } from "../types.js";

export const fromArray: StartOperator = (lines: string[]) =>
  () => {
    const generator = (async function* () {
      for await (const line of lines) {
        yield line;
      }
    })();
    return ShellStream.builder(generator);
  };
