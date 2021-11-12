(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./tap.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.logWithTimestamp = void 0;
    const tap_js_1 = require("./tap.js");
    const logWithTimestamp = () => (shellStream) => (0, tap_js_1.tap)((line) => {
        console.log(`${new Date().toISOString()} ${line}`);
    })(shellStream);
    exports.logWithTimestamp = logWithTimestamp;
});
