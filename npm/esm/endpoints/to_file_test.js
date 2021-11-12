import * as denoShim from "deno.ns";
import { FromArray, FromFile } from "../shell_stream.js";
import { assertEquals } from "../test_deps.js";
denoShim.Deno.test("toFile", async () => {
    const path = await denoShim.Deno.makeTempFile();
    const array = ["line1", "line2"];
    await FromArray(array).toFile(path);
    const res = await FromFile(path).toArray();
    await denoShim.Deno.remove(path);
    assertEquals(res, array);
});
