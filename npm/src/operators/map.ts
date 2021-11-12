import { ShellStream } from "../shell_stream.js";
import { Generator, Operator } from "../types.js";

export type MapFunction = (line: string) => string;

export const map: Operator = (mapFunction: MapFunction) =>
  (shellStream: ShellStream) => {
    const generator: Generator = (async function* () {
      for await (const line of shellStream.generator) {
        yield mapFunction(line);
      }
    })();
    return ShellStream.builder(generator, shellStream);
  };
