(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "deno.ns", "./run.js", "../test_deps.js", "../shell_stream.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const denoShim = (0, tslib_1.__importStar)(require("deno.ns"));
    const run_js_1 = require("./run.js");
    const test_deps_js_1 = require("../test_deps.js");
    const shell_stream_js_1 = require("../shell_stream.js");
    denoShim.Deno.test("parseCmdString", () => {
        (0, test_deps_js_1.assertEquals)((0, run_js_1.parseCmdString)("echo aa bb"), ["echo", "aa", "bb"]);
        (0, test_deps_js_1.assertEquals)((0, run_js_1.parseCmdString)(`echo 'aa bb' "cc dd"`), [
            "echo",
            "aa bb",
            "cc dd",
        ]);
        (0, test_deps_js_1.assertEquals)((0, run_js_1.parseCmdString)("echo 'aa \"c c\" bb'"), ["echo", 'aa "c c" bb']);
        (0, test_deps_js_1.assertEquals)((0, run_js_1.parseCmdString)(`echo "'aa'"`), ["echo", "'aa'"]);
        (0, test_deps_js_1.assertEquals)((0, run_js_1.parseCmdString)(`echo '"aa"'`), ["echo", '"aa"']);
        (0, test_deps_js_1.assertEquals)((0, run_js_1.parseCmdString)(`echo "''"`), ["echo", "''"]);
        (0, test_deps_js_1.assertEquals)((0, run_js_1.parseCmdString)(`echo '""'`), ["echo", '""']);
    });
    denoShim.Deno.test("run", async () => {
        const denoSh = `
import { copy } from "https://deno.land/std@0.112.0/io/util.ts";
await copy(Deno.stdin, Deno.stdout);`;
        const out = await (0, shell_stream_js_1.FromArray)(["line1"])
            .run([denoShim.Deno.execPath(), "eval", denoSh])
            .toString();
        (0, test_deps_js_1.assertEquals)(out, "line1");
    });
    denoShim.Deno.test("run-stdout", async () => {
        const denoSh = `console.log('line2');`;
        const out = await (0, shell_stream_js_1.FromArray)(["line1"])
            .run([denoShim.Deno.execPath(), "eval", denoSh])
            .toString();
        (0, test_deps_js_1.assertEquals)(out, "line2");
    });
    denoShim.Deno.test("run-stderr", async () => {
        const denoSh = `console.log('line2');console.error('line3');`;
        const res = await (0, shell_stream_js_1.FromArray)(["line1"])
            .run([denoShim.Deno.execPath(), "eval", denoSh], { streamStdErr: true })
            .close();
        (0, test_deps_js_1.assertEquals)(res.out[0], "line3");
        (0, test_deps_js_1.assertEquals)(res.success, true);
    });
    denoShim.Deno.test("run-thrown", async () => {
        const denoSh = `Deno.exit(1)`;
        let thrown = false;
        try {
            await (0, shell_stream_js_1.FromRun)([denoShim.Deno.execPath(), "eval", denoSh], {
                throwIfRunFail: true,
            }).toString();
        }
        catch (_e) {
            thrown = true;
        }
        (0, test_deps_js_1.assert)(thrown);
    });
    denoShim.Deno.test("run-thrown-false", async () => {
        const denoSh = `Deno.exit(1)`;
        const res = await (0, shell_stream_js_1.FromRun)([denoShim.Deno.execPath(), "eval", denoSh], {
            throwIfRunFail: false,
        }).close();
        (0, test_deps_js_1.assertEquals)(res.success, false);
    });
    denoShim.Deno.test("run-KILL", async () => {
        const res = await (0, shell_stream_js_1.FromRun)([
            denoShim.Deno.execPath(),
            "eval",
            "console.log(1);await new Promise(r=>setTimeout(r,100000));Deno.exit(1)",
        ])
            .run([denoShim.Deno.execPath(), "eval", "console.log(2);Deno.exit(2)"])
            .close({ processes: "KILL" });
        (0, test_deps_js_1.assertEquals)(res.statuses[0]?.code, 130);
        (0, test_deps_js_1.assertEquals)(res.statuses[1]?.code, 2);
    });
    denoShim.Deno.test("run-out", async () => {
        const res = await (0, shell_stream_js_1.FromRun)([
            denoShim.Deno.execPath(),
            "eval",
            "console.log('aa');console.log('bb');",
        ]).close();
        (0, test_deps_js_1.assert)(res.success);
        (0, test_deps_js_1.assertEquals)(res.out, ["aa", "bb"]);
    });
    denoShim.Deno.test("run-single-line", async () => {
        const res = await (0, shell_stream_js_1.FromRun)([
            denoShim.Deno.execPath(),
            "eval",
            "console.log('aa')",
        ]).close();
        (0, test_deps_js_1.assert)(res.success);
        (0, test_deps_js_1.assertEquals)(res.out, ["aa"]);
    });
    denoShim.Deno.test("run-long-line", async () => {
        const length = 5000;
        const longLine = "x".repeat(length);
        const res = await (0, shell_stream_js_1.FromRun)([
            denoShim.Deno.execPath(),
            "eval",
            `console.log('x'.repeat(${length}))`,
        ]).close();
        (0, test_deps_js_1.assert)(res.success);
        (0, test_deps_js_1.assertEquals)(res.out, [longLine]);
    });
    denoShim.Deno.test("run-env", async () => {
        const denoSh = `console.log('aaa='+Deno.env.get('aaa'))`;
        const out = await (0, shell_stream_js_1.FromRun)([denoShim.Deno.execPath(), "eval", denoSh], {
            env: { aaa: "bbb" },
        }).toString();
        (0, test_deps_js_1.assertEquals)(out, "aaa=bbb");
    });
});
