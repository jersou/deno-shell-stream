import { dirToStream } from "./dirToStream.ts";
import { streamToArray } from "./StreamToArray.ts";
import { assertEquals } from "../test_deps.ts";
import { Stream } from "../Stream.ts";

Deno.test({
  name: "dirToStream",
  async fn() {
    const stream = dirToStream("./test-data");
    const arr = await streamToArray(stream);
    const names = arr.map((e) => e.name);
    names.sort();
    const expected = ["dir-a", "dir-b", "file-1", "file-2", "file-3"];
    assertEquals(names, expected);
  },
});

Deno.test({
  name: "Stream.dirToStream",
  async fn() {
    const arr = await Stream.fromDir("./test-data").toArray();
    const names = arr.map((e) => e.name);
    names.sort();
    assertEquals(names, ["dir-a", "dir-b", "file-1", "file-2", "file-3"]);
  },
});
