import { FromArray } from "../shell_stream.ts";
import { assertEquals } from "../test_deps.ts";

Deno.test("close", async () => {
  const res = await FromArray(["1"]).close();
  assertEquals(res, {
    out: ["1"],
    statuses: [],
    success: true,
  });
});
