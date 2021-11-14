(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../shell_stream.js", "../deps.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromWalk = void 0;
    const shell_stream_js_1 = require("../shell_stream.js");
    const deps_js_1 = require("../deps.js");
    const fromWalk = (path, opt) => () => {
        const generator = (async function* () {
            for await (const dirEntry of (0, deps_js_1.walk)(path, opt)) {
                yield dirEntry.path;
            }
        })();
        return shell_stream_js_1.ShellStream.builder(generator);
    };
    exports.fromWalk = fromWalk;
});
