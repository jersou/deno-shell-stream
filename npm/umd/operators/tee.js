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
    exports.tee = void 0;
    const tslib_1 = require("tslib");
    const denoShim = (0, tslib_1.__importStar)(require("deno.ns"));
    const shell_stream_js_1 = require("../shell_stream.js");
    const tee = (outputPath) => (stream) => {
        const generator = (async function* () {
            stream.file = await denoShim.Deno.open(outputPath, {
                write: true,
                create: true,
            });
            const encoder = new TextEncoder();
            let start = true;
            for await (const line of stream.generator) {
                if (start) {
                    await denoShim.Deno.write(stream.file.rid, encoder.encode(line));
                    start = false;
                }
                else {
                    await denoShim.Deno.write(stream.file.rid, encoder.encode("\n" + line));
                }
                yield line;
            }
            stream.file.close();
        })();
        return shell_stream_js_1.ShellStream.builder(generator, stream);
    };
    exports.tee = tee;
});
