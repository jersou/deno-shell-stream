(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./buffer.js", "./readers.js", "./streams.js", "./util.js", "./writers.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sliceLongToBytes = exports.readShort = exports.readLong = exports.readInt = exports.copyN = void 0;
    const tslib_1 = require("tslib");
    // Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
    (0, tslib_1.__exportStar)(require("./buffer.js"), exports);
    (0, tslib_1.__exportStar)(require("./readers.js"), exports);
    (0, tslib_1.__exportStar)(require("./streams.js"), exports);
    var util_js_1 = require("./util.js");
    Object.defineProperty(exports, "copyN", { enumerable: true, get: function () { return util_js_1.copyN; } });
    Object.defineProperty(exports, "readInt", { enumerable: true, get: function () { return util_js_1.readInt; } });
    Object.defineProperty(exports, "readLong", { enumerable: true, get: function () { return util_js_1.readLong; } });
    Object.defineProperty(exports, "readShort", { enumerable: true, get: function () { return util_js_1.readShort; } });
    Object.defineProperty(exports, "sliceLongToBytes", { enumerable: true, get: function () { return util_js_1.sliceLongToBytes; } });
    (0, tslib_1.__exportStar)(require("./writers.js"), exports);
});
