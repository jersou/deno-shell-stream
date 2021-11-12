import * as denoShim from "deno.ns";
import { FromRun } from "../shell_stream.js";
import { assertEquals } from "../test_deps.js";

denoShim.Deno.test("toFile", async () => {
  const res0 = await FromRun([
    denoShim.Deno.execPath(),
    "eval",
    "Deno.exit(0)",
  ]).success();
  assertEquals(res0, true);
  const res1 = await FromRun([
    denoShim.Deno.execPath(),
    "eval",
    "Deno.exit(1)",
  ]).success();
  assertEquals(res1, false);
});
