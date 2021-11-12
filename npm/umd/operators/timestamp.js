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
    exports.timestamp = void 0;
    const shell_stream_js_1 = require("../shell_stream.js");
    const timestamp = () => (shellStream) => {
        const inputGenerator = (async function* () {
            for await (const line of shellStream.generator) {
                const ts = new Date().toISOString();
                yield `${ts} ${line}`;
            }
        })();
        return shell_stream_js_1.ShellStream.builder(inputGenerator, shellStream);
    };
    exports.timestamp = timestamp;
});
