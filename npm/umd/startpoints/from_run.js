(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../shell_stream.js", "../operators/run.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromRun = void 0;
    const shell_stream_js_1 = require("../shell_stream.js");
    const run_js_1 = require("../operators/run.js");
    const fromRun = (cmd, opt) => () => (0, run_js_1.run)(cmd, opt)(shell_stream_js_1.ShellStream.empty());
    exports.fromRun = fromRun;
});
