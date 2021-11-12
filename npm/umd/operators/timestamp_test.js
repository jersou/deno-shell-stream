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
    denoShim.Deno.test("timestamp", async () => {
        const out = await (0, shell_stream_js_1.FromArray)(["line1"]).timestamp().toString();
        (0, test_deps_js_1.assert)(out.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}.*line1/));
    });
});
