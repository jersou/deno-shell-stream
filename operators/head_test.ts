import { assertEquals } from "../test_deps.ts";
import { FromArray } from "../shell_stream.ts";

Deno.test("head", async () => {
  const res = await FromArray(["line1", "line222"]).head(1).toArray();
  assertEquals(res, ["line1"]);
});
