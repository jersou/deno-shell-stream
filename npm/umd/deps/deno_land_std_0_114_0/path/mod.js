// Copyright the Browserify authors. MIT License.
// Ported mostly from https://github.com/browserify/path-browserify/
// This module is browser compatible.
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../_util/os.js", "./win32.js", "./posix.js", "./common.js", "./separator.js", "./_interface.js", "./glob.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SEP_PATTERN = exports.SEP = exports.toNamespacedPath = exports.toFileUrl = exports.sep = exports.resolve = exports.relative = exports.parse = exports.normalize = exports.join = exports.isAbsolute = exports.fromFileUrl = exports.format = exports.extname = exports.dirname = exports.delimiter = exports.basename = exports.posix = exports.win32 = void 0;
    const tslib_1 = require("tslib");
    const os_js_1 = require("../_util/os.js");
    const _win32 = (0, tslib_1.__importStar)(require("./win32.js"));
    const _posix = (0, tslib_1.__importStar)(require("./posix.js"));
    const path = os_js_1.isWindows ? _win32 : _posix;
    exports.win32 = _win32;
    exports.posix = _posix;
    exports.basename = path.basename, exports.delimiter = path.delimiter, exports.dirname = path.dirname, exports.extname = path.extname, exports.format = path.format, exports.fromFileUrl = path.fromFileUrl, exports.isAbsolute = path.isAbsolute, exports.join = path.join, exports.normalize = path.normalize, exports.parse = path.parse, exports.relative = path.relative, exports.resolve = path.resolve, exports.sep = path.sep, exports.toFileUrl = path.toFileUrl, exports.toNamespacedPath = path.toNamespacedPath;
    (0, tslib_1.__exportStar)(require("./common.js"), exports);
    var separator_js_1 = require("./separator.js");
    Object.defineProperty(exports, "SEP", { enumerable: true, get: function () { return separator_js_1.SEP; } });
    Object.defineProperty(exports, "SEP_PATTERN", { enumerable: true, get: function () { return separator_js_1.SEP_PATTERN; } });
    (0, tslib_1.__exportStar)(require("./_interface.js"), exports);
    (0, tslib_1.__exportStar)(require("./glob.js"), exports);
});
