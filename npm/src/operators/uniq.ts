import { ShellStream } from "../shell_stream.js";
import { Operator } from "../types.js";

export const uniq: Operator = () =>
  (shellStream: ShellStream) => {
    const generator = (async function* () {
      let lastEmit;
      for await (const line of shellStream.generator) {
        if (lastEmit !== line) {
          lastEmit = line;
          yield line;
        }
      }
    })();
    return ShellStream.builder(generator, shellStream);
  };
