export function arrayToStream<T>(array: T[]) {
  return new ReadableStream<T>({
    start(controller) {
      array.map((e) => controller.enqueue(e));
      controller.close();
    },
  });
}
