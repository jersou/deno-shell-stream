// Copyright the Browserify authors. MIT License.
// Ported mostly from https://github.com/browserify/path-browserify/
// This module is browser compatible.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../_util/os.js", "./win32.js", "./posix.js", "./common.js", "./separator.js", "./_interface.js", "./glob.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SEP_PATTERN = exports.SEP = exports.toNamespacedPath = exports.toFileUrl = exports.sep = exports.resolve = exports.relative = exports.parse = exports.normalize = exports.join = exports.isAbsolute = exports.fromFileUrl = exports.format = exports.extname = exports.dirname = exports.delimiter = exports.basename = exports.posix = exports.win32 = void 0;
    const os_js_1 = require("../_util/os.js");
    const _win32 = __importStar(require("./win32.js"));
    const _posix = __importStar(require("./posix.js"));
    const path = os_js_1.isWindows ? _win32 : _posix;
    exports.win32 = _win32;
    exports.posix = _posix;
    exports.basename = path.basename, exports.delimiter = path.delimiter, exports.dirname = path.dirname, exports.extname = path.extname, exports.format = path.format, exports.fromFileUrl = path.fromFileUrl, exports.isAbsolute = path.isAbsolute, exports.join = path.join, exports.normalize = path.normalize, exports.parse = path.parse, exports.relative = path.relative, exports.resolve = path.resolve, exports.sep = path.sep, exports.toFileUrl = path.toFileUrl, exports.toNamespacedPath = path.toNamespacedPath;
    __exportStar(require("./common.js"), exports);
    var separator_js_1 = require("./separator.js");
    Object.defineProperty(exports, "SEP", { enumerable: true, get: function () { return separator_js_1.SEP; } });
    Object.defineProperty(exports, "SEP_PATTERN", { enumerable: true, get: function () { return separator_js_1.SEP_PATTERN; } });
    __exportStar(require("./_interface.js"), exports);
    __exportStar(require("./glob.js"), exports);
});
