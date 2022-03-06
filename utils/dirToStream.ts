export function dirToStream(path: string) {
  return new ReadableStream<Deno.DirEntry>({
    async start(controller) {
      for await (const dirEntry of Deno.readDir(path)) {
        controller.enqueue(dirEntry);
      }
      controller.close();
    },
  });
}
