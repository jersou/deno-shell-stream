import { arrayToStream } from "./ArrayToStream.ts";
import { streamToArray } from "./StreamToArray.ts";
import { assertEquals } from "../test_deps.ts";

Deno.test({
  name: "streamToArray",
  fn: async () => {
    const inputArray = ["line1", "line2", "line3", "line4", "line5"];
    const readableStream = arrayToStream(inputArray);
    const array = await streamToArray(readableStream);
    assertEquals(array, inputArray);
  },
});
