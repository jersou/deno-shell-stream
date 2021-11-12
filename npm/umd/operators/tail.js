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
    exports.tail = void 0;
    const shell_stream_js_1 = require("../shell_stream.js");
    const tail = (count = 1) => (shellStream) => {
        const generator = (async function* () {
            const buffer = [];
            for await (const line of shellStream.generator) {
                buffer.push(line);
                if (buffer.length > count) {
                    buffer.shift();
                }
            }
            for (const line of buffer) {
                yield line;
            }
        })();
        return shell_stream_js_1.ShellStream.builder(generator, shellStream);
    };
    exports.tail = tail;
});
