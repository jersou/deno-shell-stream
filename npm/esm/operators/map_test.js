import * as denoShim from "deno.ns";
import { assertEquals } from "../test_deps.js";
import { FromArray } from "../shell_stream.js";
denoShim.Deno.test("map", async () => {
    const res = await FromArray(["line1", "line2"])
        .map((l) => l + "__")
        .toArray();
    assertEquals(res, ["line1__", "line2__"]);
});
