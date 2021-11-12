(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "deno.ns", "../shell_stream.js", "../test_deps.js", "./close.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const denoShim = (0, tslib_1.__importStar)(require("deno.ns"));
    const shell_stream_js_1 = require("../shell_stream.js");
    const test_deps_js_1 = require("../test_deps.js");
    const close_js_1 = require("./close.js");
    denoShim.Deno.test("close", async () => {
        const res = await (0, shell_stream_js_1.FromArray)(["1"]).close();
        (0, test_deps_js_1.assertEquals)(res, new close_js_1.CloseRes(true, [], ["1"]));
    });
    denoShim.Deno.test("close", async () => {
        const res = await (0, shell_stream_js_1.FromArray)(["1", "2"]).close();
        (0, test_deps_js_1.assertEquals)(res, new close_js_1.CloseRes(true, [], ["1", "2"]));
        (0, test_deps_js_1.assertEquals)(res.tostring(), "1\n2");
    });
});
