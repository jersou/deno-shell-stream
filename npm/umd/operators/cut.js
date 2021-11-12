(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./map.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cut = void 0;
    const map_js_1 = require("./map.js");
    const cut = (delim, indexes, sep = " ") => (shellStream) => (0, map_js_1.map)((line) => {
        const parts = line.split(delim);
        return indexes.map((i) => parts[i]).join(sep);
    })(shellStream);
    exports.cut = cut;
});
