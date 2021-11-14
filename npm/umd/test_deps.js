(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./deps/deno_land_std_0_114_0/testing/asserts.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assertEquals = exports.assertArrayIncludes = exports.assert = void 0;
    var asserts_js_1 = require("./deps/deno_land_std_0_114_0/testing/asserts.js");
    Object.defineProperty(exports, "assert", { enumerable: true, get: function () { return asserts_js_1.assert; } });
    Object.defineProperty(exports, "assertArrayIncludes", { enumerable: true, get: function () { return asserts_js_1.assertArrayIncludes; } });
    Object.defineProperty(exports, "assertEquals", { enumerable: true, get: function () { return asserts_js_1.assertEquals; } });
});
