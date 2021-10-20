import { FromRun } from "../shell_stream.ts";
import { assertEquals } from "../test_deps.ts";

Deno.test("toFile", async () => {
  const res0 = await FromRun([
    Deno.execPath(),
    "eval",
    "Deno.exit(0)",
  ]).success();
  assertEquals(res0, true);
  const res1 = await FromRun([
    Deno.execPath(),
    "eval",
    "Deno.exit(1)",
  ]).success();
  assertEquals(res1, false);
});
