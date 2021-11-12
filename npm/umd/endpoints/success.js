(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./close.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.success = void 0;
    const close_js_1 = require("./close.js");
    const success = () => async (shellStream) => (await (0, close_js_1.close)()(shellStream)).success;
    exports.success = success;
});
