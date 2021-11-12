(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./from_array.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromString = void 0;
    const from_array_js_1 = require("./from_array.js");
    const fromString = (line) => (0, from_array_js_1.fromArray)(line.split("\n"));
    exports.fromString = fromString;
});
