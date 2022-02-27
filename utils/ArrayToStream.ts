export function arrayToStream(array: string[]) {
  return new ReadableStream({
    start(controller) {
      array.map((e) => controller.enqueue(e));
      controller.close();
    },
  });
}
