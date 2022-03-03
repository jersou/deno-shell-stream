import { walk, WalkEntry, WalkOptions } from "../deps.ts";

export function walkToStream(path: string, opt?: WalkOptions) {
  return new ReadableStream<WalkEntry>({
    async start(controller) {
      for await (const dirEntry of walk(path, opt)) {
        controller.enqueue(dirEntry);
      }
      controller.close();
    },
  });
}
