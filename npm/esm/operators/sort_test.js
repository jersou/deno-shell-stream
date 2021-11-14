import * as denoShim from "deno.ns";
import { assertEquals } from "../test_deps.js";
import { FromArray } from "../shell_stream.js";
denoShim.Deno.test("sort", async () => {
    const res = await FromArray(["line1", "line3", "line4", "line2"])
        .sort()
        .toArray();
    assertEquals(res, ["line1", "line2", "line3", "line4"]);
});
