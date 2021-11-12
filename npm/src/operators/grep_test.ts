import * as denoShim from "deno.ns";
import { assertEquals } from "../test_deps.js";
import { FromArray } from "../shell_stream.js";

denoShim.Deno.test("grep", async () => {
  const res = await FromArray(["line1", "line222"]).grep(/22/).toArray();
  assertEquals(res, ["line222"]);
});
