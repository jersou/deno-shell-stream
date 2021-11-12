import { ShellStream } from "../shell_stream.js";
import { Operator } from "../types.js";

export type FilterFunction = (line: string) => boolean;

export const filter: Operator = (filterFunction: FilterFunction) =>
  (shellStream: ShellStream) => {
    const generator = (async function* () {
      for await (const line of shellStream.generator) {
        if (filterFunction(line)) {
          yield line;
        }
      }
    })();
    return ShellStream.builder(generator, shellStream);
  };
