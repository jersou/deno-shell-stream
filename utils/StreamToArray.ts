export async function streamToArray(
  stream: ReadableStream<string>,
): Promise<string[]> {
  const array = [];
  const reader = stream.getReader();
  let res;
  while (!res?.done) {
    res = await reader.read();
    if (res.value) {
      array.push(res.value);
    }
  }
  reader.releaseLock();
  return array;
}
