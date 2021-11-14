import * as denoShim from "deno.ns";
import { assertEquals } from "../test_deps.js";
import { FromArray } from "../shell_stream.js";
denoShim.Deno.test("sort", async () => {
    const res = await FromArray(["line2", "line3", "line3", "line1"])
        .uniq()
        .toArray();
    assertEquals(res, ["line2", "line3", "line1"]);
});
