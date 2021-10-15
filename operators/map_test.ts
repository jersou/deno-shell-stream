import { assertEquals } from "../test_deps.ts";
import { FromArray } from "../shell_stream.ts";

Deno.test("map", async () => {
  const res = await FromArray(["line1", "line2"])
    .map((l) => l + "__")
    .toArray();
  assertEquals(res, ["line1__", "line2__"]);
});
