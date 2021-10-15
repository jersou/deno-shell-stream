import { ShellStream } from "../shell_stream.ts";
import { Generator, Operator } from "../types.ts";

export const tee: Operator = (outputPath: string) =>
  (stream: ShellStream) => {
    const generator: Generator = (async function* () {
      stream.file = await Deno.open(outputPath, {
        write: true,
        create: true,
      });
      const encoder = new TextEncoder();
      for await (const line of stream.generator) {
        await Deno.write(stream.file.rid, encoder.encode(line + "\n"));
        yield line;
      }
      stream.file.close();
    })();

    return ShellStream.builder(generator, stream);
  };
