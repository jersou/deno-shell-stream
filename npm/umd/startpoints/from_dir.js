(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "deno.ns", "../shell_stream.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromDir = void 0;
    const tslib_1 = require("tslib");
    const denoShim = (0, tslib_1.__importStar)(require("deno.ns"));
    const shell_stream_js_1 = require("../shell_stream.js");
    const fromDir = (path) => () => {
        const generator = (async function* () {
            for await (const dirEntry of denoShim.Deno.readDir(path)) {
                yield dirEntry.name;
            }
        })();
        return shell_stream_js_1.ShellStream.builder(generator);
    };
    exports.fromDir = fromDir;
});
