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
    exports.replace = void 0;
    const map_js_1 = require("./map.js");
    const replace = (searchValue, replacer) => (shellStream) => {
        return (0, map_js_1.map)((line) => {
            if (typeof replacer === "string") {
                return line.replace(searchValue, replacer);
            }
            else {
                return line.replace(searchValue, replacer);
            }
        })(shellStream);
    };
    exports.replace = replace;
});
