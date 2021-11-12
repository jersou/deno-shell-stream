import * as denoShim from "deno.ns";
import { assertEquals } from "../test_deps.js";
import { FromArray } from "../shell_stream.js";
denoShim.Deno.test("replace_str", async () => {
    const res = await FromArray(["line1", "line2"]).replace("in", "-").toArray();
    assertEquals(res, ["l-e1", "l-e2"]);
});
denoShim.Deno.test("replace_regex", async () => {
    const res = await FromArray(["line1line", "line2line"])
        .replace(/in(e[0-9])/g, "aa_$1_bb")
        .toArray();
    assertEquals(res, ["laa_e1_bbline", "laa_e2_bbline"]);
});
denoShim.Deno.test("replace_replacer", async () => {
    const replacer = (_match, v1) => v1;
    const res = await FromArray(["line1line", "line2line"])
        .replace(/in(e[0-9])/g, replacer)
        .toArray();
    assertEquals(res, ["le1line", "le2line"]);
});
