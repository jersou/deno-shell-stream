import * as denoShim from "deno.ns";
import { assertEquals } from "../test_deps.js";
import { FromArray } from "../shell_stream.js";
denoShim.Deno.test("cut", async () => {
    const res = await FromArray(["a:b:c:d:e::", "1:2:3:4:5::"])
        .cut(":", [4, 0, 1, 5, 10, 2], "-")
        .toArray();
    assertEquals(res, ["e-a-b---c", "5-1-2---3"]);
});
