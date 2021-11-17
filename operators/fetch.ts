import { ShellStream } from "../shell_stream.ts";
import { Operator } from "../types.ts";

async function* streamUrl(url: string, init?: RequestInit) {
  const resp = await fetch(url, init);
  const text = await resp.text();
  for (const line of text.split("\n")) {
    yield line;
  }
}

export const fetchUrl: Operator = (url?: string, init?: RequestInit) =>
  (shellStream: ShellStream) => {
    const generator = (async function* () {
      if (url) {
        for await (const line of streamUrl(url, init)) {
          yield line;
        }
      } else {
        for await (const urlFromStream of shellStream.generator) {
          for await (const line of streamUrl(urlFromStream, init)) {
            yield line;
          }
        }
      }
    })();
    return ShellStream.builder(generator, shellStream);
  };
