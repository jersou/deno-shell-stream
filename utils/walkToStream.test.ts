import { walkToStream } from "./walkToStream.ts";
import { streamToArray } from "./StreamToArray.ts";
import { assertEquals } from "../test_deps.ts";
import { Stream } from "../Stream.ts";

Deno.test({
  name: "walkToStream",
  async fn() {
    const stream = walkToStream("./test-data");
    const arr = await streamToArray(stream);
    const paths = arr.map((e) => e.path);
    paths.sort();
    assertEquals(paths, [
      "test-data",
      "test-data/dir-a",
      "test-data/dir-a/file-4",
      "test-data/dir-a/file-5",
      "test-data/dir-b",
      "test-data/dir-b/file-6",
      "test-data/dir-b/file-7",
      "test-data/file-1",
      "test-data/file-2",
      "test-data/file-3",
    ]);
  },
});

Deno.test({
  name: "Stream.fromWalk",
  async fn() {
    const arr = await Stream.fromWalk("./test-data").toArray();
    const paths = arr.map((e) => e.path);
    paths.sort();
    assertEquals(paths, [
      "test-data",
      "test-data/dir-a",
      "test-data/dir-a/file-4",
      "test-data/dir-a/file-5",
      "test-data/dir-b",
      "test-data/dir-b/file-6",
      "test-data/dir-b/file-7",
      "test-data/file-1",
      "test-data/file-2",
      "test-data/file-3",
    ]);
  },
});
