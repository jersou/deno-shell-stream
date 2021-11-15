import { FromArray } from "../shell_stream.ts";
import { assertEquals } from "../test_deps.ts";

Deno.test("toIterable", async () => {
  const iterable = FromArray(["line1", "line2"]).toIterable();
  const res = [];
  for await (const str of iterable) {
    res.push(str);
  }
  assertEquals(res, ["line1", "line2"]);
});
