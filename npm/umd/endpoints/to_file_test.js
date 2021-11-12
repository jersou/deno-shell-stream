(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "deno.ns", "../shell_stream.js", "../test_deps.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const denoShim = (0, tslib_1.__importStar)(require("deno.ns"));
    const shell_stream_js_1 = require("../shell_stream.js");
    const test_deps_js_1 = require("../test_deps.js");
    denoShim.Deno.test("toFile", async () => {
        const path = await denoShim.Deno.makeTempFile();
        const array = ["line1", "line2"];
        await (0, shell_stream_js_1.FromArray)(array).toFile(path);
        const res = await (0, shell_stream_js_1.FromFile)(path).toArray();
        await denoShim.Deno.remove(path);
        (0, test_deps_js_1.assertEquals)(res, array);
    });
});
