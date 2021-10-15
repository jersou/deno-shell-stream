import { assertEquals } from "../test_deps.ts";
import { FromArray } from "../shell_stream.ts";

Deno.test("filter", async () => {
  const res = await FromArray(["line1", "line222"])
    .filter((l) => l.length < 6)
    .toArray();
  assertEquals(res, ["line1"]);
});
