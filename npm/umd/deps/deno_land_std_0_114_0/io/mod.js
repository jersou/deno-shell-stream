var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./buffer.js", "./readers.js", "./streams.js", "./util.js", "./writers.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sliceLongToBytes = exports.readShort = exports.readLong = exports.readInt = exports.copyN = void 0;
    // Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
    __exportStar(require("./buffer.js"), exports);
    __exportStar(require("./readers.js"), exports);
    __exportStar(require("./streams.js"), exports);
    var util_js_1 = require("./util.js");
    Object.defineProperty(exports, "copyN", { enumerable: true, get: function () { return util_js_1.copyN; } });
    Object.defineProperty(exports, "readInt", { enumerable: true, get: function () { return util_js_1.readInt; } });
    Object.defineProperty(exports, "readLong", { enumerable: true, get: function () { return util_js_1.readLong; } });
    Object.defineProperty(exports, "readShort", { enumerable: true, get: function () { return util_js_1.readShort; } });
    Object.defineProperty(exports, "sliceLongToBytes", { enumerable: true, get: function () { return util_js_1.sliceLongToBytes; } });
    __exportStar(require("./writers.js"), exports);
});
