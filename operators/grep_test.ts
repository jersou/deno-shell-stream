import { assertEquals } from "../test_deps.ts";
import { FromArray } from "../shell_stream.ts";

Deno.test("grep", async () => {
  const res = await FromArray(["line1", "line222"]).grep(/22/).toArray();
  assertEquals(res, ["line222"]);
});
