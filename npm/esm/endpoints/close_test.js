import * as denoShim from "deno.ns";
import { FromArray } from "../shell_stream.js";
import { assertEquals } from "../test_deps.js";
import { CloseRes } from "./close.js";
denoShim.Deno.test("close", async () => {
    const res = await FromArray(["1"]).close();
    assertEquals(res, new CloseRes(true, [], ["1"]));
});
denoShim.Deno.test("close", async () => {
    const res = await FromArray(["1", "2"]).close();
    assertEquals(res, new CloseRes(true, [], ["1", "2"]));
    assertEquals(res.tostring(), "1\n2");
});
