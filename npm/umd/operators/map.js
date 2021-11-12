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
    exports.map = void 0;
    const shell_stream_js_1 = require("../shell_stream.js");
    const map = (mapFunction) => (shellStream) => {
        const generator = (async function* () {
            for await (const line of shellStream.generator) {
                yield mapFunction(line);
            }
        })();
        return shell_stream_js_1.ShellStream.builder(generator, shellStream);
    };
    exports.map = map;
});
