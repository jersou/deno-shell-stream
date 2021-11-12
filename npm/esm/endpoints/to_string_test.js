import * as denoShim from "deno.ns";
import { FromArray } from "../shell_stream.js";
import { assertEquals } from "../test_deps.js";
denoShim.Deno.test("toFile", async () => {
    const str = await FromArray(["line1", "line2"]).toString();
    assertEquals(str, "line1\nline2");
});
