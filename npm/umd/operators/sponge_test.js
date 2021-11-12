(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "deno.ns", "../test_deps.js", "../shell_stream.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const denoShim = (0, tslib_1.__importStar)(require("deno.ns"));
    const test_deps_js_1 = require("../test_deps.js");
    const shell_stream_js_1 = require("../shell_stream.js");
    denoShim.Deno.test("sponge", async () => {
        const tmpPath = await denoShim.Deno.makeTempFile();
        await (0, shell_stream_js_1.FromArray)(["line1", "line2", "line3", "line4"]).toFile(tmpPath);
        await (0, shell_stream_js_1.FromFile)(tmpPath, { closeBeforeStreaming: true })
            .map((line) => "mod-> " + line)
            .sponge()
            .tee(tmpPath)
            .close();
        const res = await (0, shell_stream_js_1.FromFile)(tmpPath).toArray();
        await denoShim.Deno.remove(tmpPath);
        (0, test_deps_js_1.assertEquals)(res, [
            "mod-> line1",
            "mod-> line2",
            "mod-> line3",
            "mod-> line4",
        ]);
    });
});
