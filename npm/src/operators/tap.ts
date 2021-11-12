import { ShellStream } from "../shell_stream.js";
import { Generator, Operator } from "../types.js";

export type TapFunction = (line: string) => unknown;

export const tap: Operator = (tapFunction: TapFunction) =>
  (shellStream: ShellStream) => {
    const generator: Generator = (async function* () {
      for await (const line of shellStream.generator) {
        tapFunction(line);
        yield line;
      }
    })();
    return ShellStream.builder(generator, shellStream);
  };
