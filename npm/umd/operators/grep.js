(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./filter.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.grep = void 0;
    const filter_js_1 = require("./filter.js");
    const grep = (regex) => (shellStream) => (0, filter_js_1.filter)((line) => regex.test(line))(shellStream);
    exports.grep = grep;
});
