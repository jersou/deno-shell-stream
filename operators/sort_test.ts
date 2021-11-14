import { assertEquals } from "../test_deps.ts";
import { FromArray, FromFile } from "../shell_stream.ts";

Deno.test("sort", async () => {
  const res = await FromArray(["line1", "line3", "line4", "line2"])
    .sort()
    .toArray();
  assertEquals(res, ["line1", "line2", "line3", "line4"]);
});
