import * as denoShim from "deno.ns";
import { assertEquals } from "../test_deps.js";
import { FromArray } from "../shell_stream.js";
denoShim.Deno.test("filter", async () => {
    const res = await FromArray(["line1", "line222"])
        .filter((l) => l.length < 6)
        .toArray();
    assertEquals(res, ["line1"]);
});
