import { ShellStream } from "../shell_stream.js";
import { Operator } from "../types.js";

export const timestamp: Operator = () =>
  (shellStream: ShellStream) => {
    const inputGenerator = (async function* () {
      for await (const line of shellStream.generator) {
        const ts = new Date().toISOString();
        yield `${ts} ${line}`;
      }
    })();

    return ShellStream.builder(inputGenerator, shellStream);
  };
