import * as denoShim from "deno.ns";
import { FromArray } from "../shell_stream.js";
import { assertEquals } from "../test_deps.js";
denoShim.Deno.test("toIterable", async () => {
    const iterable = FromArray(["line1", "line2"]).toIterable();
    const res = [];
    for await (const str of iterable) {
        res.push(str);
    }
    assertEquals(res, ["line1", "line2"]);
});
