import { FromArray, FromFile } from "../shell_stream.ts";
import { assertEquals } from "../test_deps.ts";

Deno.test("toFile", async () => {
  const str = await FromArray(["line1", "line2"]).toString();
  assertEquals(str, "line1\nline2");
});
