(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "deno.ns", "../shell_stream.js", "../deps.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromFile = void 0;
    const tslib_1 = require("tslib");
    const denoShim = (0, tslib_1.__importStar)(require("deno.ns"));
    const shell_stream_js_1 = require("../shell_stream.js");
    const deps_js_1 = require("../deps.js");
    const fromFile = (path, opt) => () => {
        const generator = (async function* () {
            if (opt?.closeBeforeStreaming) {
                const fileContent = await denoShim.Deno.readTextFile(path);
                for await (const line of fileContent.split("\n")) {
                    yield line;
                }
            }
            else {
                const file = await denoShim.Deno.open(path);
                for await (const line of (0, deps_js_1.readLines)(file)) {
                    yield line;
                }
                file.close();
            }
        })();
        return shell_stream_js_1.ShellStream.builder(generator);
    };
    exports.fromFile = fromFile;
});
