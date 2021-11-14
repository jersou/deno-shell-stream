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
    exports.from = void 0;
    const shell_stream_js_1 = require("../shell_stream.js");
    const from = (iterable) => () => {
        const generator = (async function* () {
            for await (const str of iterable) {
                yield str;
            }
        })();
        return shell_stream_js_1.ShellStream.builder(generator);
    };
    exports.from = from;
});
