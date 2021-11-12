import * as denoShim from "deno.ns";
import { ShellStream } from "../shell_stream.js";
import { Generator, Operator } from "../types.js";

export const tee: Operator = (outputPath: string) =>
  (stream: ShellStream) => {
    const generator: Generator = (async function* () {
      stream.file = await denoShim.Deno.open(outputPath, {
        write: true,
        create: true,
      });
      const encoder = new TextEncoder();
      let start = true;
      for await (const line of stream.generator) {
        if (start) {
          await denoShim.Deno.write(stream.file.rid, encoder.encode(line));
          start = false;
        } else {
          await denoShim.Deno.write(stream.file.rid, encoder.encode("\n" + line));
        }
        yield line;
      }
      stream.file.close();
    })();

    return ShellStream.builder(generator, stream);
  };
