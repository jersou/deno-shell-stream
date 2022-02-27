import { LinesTransform } from "./LinesTransform.ts";
import { assertEquals } from "https://deno.land/std@0.127.0/testing/asserts.ts";
import { arrayToStream } from "../utils/ArrayToStream.ts";
import { streamToArray } from "../utils/StreamToArray.ts";

Deno.test({
  name: "LinesTransform",
  async fn() {
    const readableStream = arrayToStream(["1", "2\n", "3", "4\n5\n6", "7"]);
    const linesTransform = new LinesTransform();
    const modifiedStream = readableStream.pipeThrough(linesTransform);
    const array = await streamToArray(modifiedStream);
    assertEquals(array, ["12", "34", "5", "67"]);
  },
});
