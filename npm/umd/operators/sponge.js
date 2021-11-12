(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../shell_stream.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sponge = void 0;
    const shell_stream_js_1 = require("../shell_stream.js");
    const sponge = () => (shellStream) => {
        const generator = (async function* () {
            const out = [];
            for await (const line of shellStream.generator) {
                out.push(line);
            }
            for await (const line of out) {
                yield line;
            }
        })();
        return shell_stream_js_1.ShellStream.builder(generator, shellStream);
    };
    exports.sponge = sponge;
});
