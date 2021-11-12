import * as denoShim from "deno.ns";
import { assertEquals } from "../test_deps.js";
import { FromArray } from "../shell_stream.js";

denoShim.Deno.test("head", async () => {
  const res = await FromArray(["line1", "line222"]).head(1).toArray();
  assertEquals(res, ["line1"]);
});
