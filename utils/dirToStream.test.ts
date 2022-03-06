import { dirToStream } from "./dirToStream.ts";
import { streamToArray } from "./StreamToArray.ts";
import { assertEquals } from "../test_deps.ts";
import { Stream } from "../Stream.ts";

Deno.test({
  name: "dirToStream",
  async fn() {
    const stream = dirToStream("./test-data");
    const arr = await streamToArray(stream);
    assertEquals(arr.map((e) => e.name), [
      "file-1",
      "dir-a",
      "file-2",
      "dir-b",
      "file-3",
    ]);
  },
});

Deno.test({
  name: "Stream.dirToStream",
  async fn() {
    const arr = await Stream.fromDir("./test-data").toArray();
    assertEquals(arr.map((e) => e.name), [
      "file-1",
      "dir-a",
      "file-2",
      "dir-b",
      "file-3",
    ]);
  },
});
