import * as denoShim from "deno.ns";
import { FromArray } from "../shell_stream.js";
import { assert } from "../test_deps.js";
denoShim.Deno.test("timestamp", async () => {
    const out = await FromArray(["line1"]).timestamp().toString();
    assert(out.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}.*line1/));
});
