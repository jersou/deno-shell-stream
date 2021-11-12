import { ShellStream } from "../shell_stream.js";
import { Operator } from "../types.js";

export const sponge: Operator = () =>
  (shellStream: ShellStream) => {
    const generator = (async function* () {
      const out: string[] = [];
      for await (const line of shellStream.generator) {
        out.push(line);
      }
      for await (const line of out) {
        yield line;
      }
    })();
    return ShellStream.builder(generator, shellStream);
  };
