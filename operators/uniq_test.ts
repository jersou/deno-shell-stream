import { assertEquals } from "../test_deps.ts";
import { FromArray, FromFile } from "../shell_stream.ts";

Deno.test("sort", async () => {
  const res = await FromArray(["line2", "line3", "line3", "line1"])
    .uniq()
    .toArray();
  assertEquals(res, ["line2", "line3", "line1"]);
});
