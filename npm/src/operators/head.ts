import { ShellStream } from "../shell_stream.js";
import { Operator } from "../types.js";

export const head: Operator = (count = 1) =>
  (shellStream: ShellStream) => {
    const generator = (async function* () {
      let i = 0;
      for await (const line of shellStream.generator) {
        yield line;
        i++;
        if (i >= count) {
          break;
        }
      }
    })();
    return ShellStream.builder(generator, shellStream);
  };
