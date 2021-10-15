import { assertEquals } from "../test_deps.ts";
import { FromArray } from "../shell_stream.ts";

Deno.test("tail", async () => {
  const res = await FromArray(["line1", "line222"]).tail(1).toArray();
  assertEquals(res, ["line222"]);
});
