import { arrayToStream } from "./ArrayToStream.ts";
import { assertEquals } from "../test_deps.ts";

Deno.test({
  name: "arrayToStream",
  fn: async () => {
    const inputArray = ["line1", "line2", "line3", "line4", "line5"];
    const readableStream = arrayToStream(inputArray);
    const reader = readableStream.getReader();
    let res = await reader.read();
    assertEquals(res, { done: false, value: "line1" });
    res = await reader.read();
    assertEquals(res, { done: false, value: "line2" });
    assertEquals(readableStream.locked, true);
    reader.releaseLock();
    assertEquals(readableStream.locked, false);
    const reader2 = readableStream.getReader();
    assertEquals(readableStream.locked, true);
    res = await reader2.read();
    assertEquals(res, { done: false, value: "line3" });
    await reader2.cancel();
    assertEquals(readableStream.locked, true);
    res = await reader2.read();
    assertEquals(res, { done: true, value: undefined });
  },
});
