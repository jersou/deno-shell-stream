import { arrayToStream } from "../utils/ArrayToStream.ts";
import { streamToArray } from "../utils/StreamToArray.ts";
import { assertEquals } from "../test_deps.ts";
import { TextLineStream } from "../deps.ts";

Deno.test({
  name: "LinesTransform",
  async fn() {
    const readableStream = arrayToStream(["1", "2\n", "3", "4\n5\n6", "7"]);
    const linesTransform = new TextLineStream();
    const modifiedStream = readableStream.pipeThrough(linesTransform);
    const array = await streamToArray(modifiedStream);
    assertEquals(array, ["12", "34", "5", "67"]);
  },
});
