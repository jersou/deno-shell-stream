// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../_util/os.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SEP_PATTERN = exports.SEP = void 0;
    const os_js_1 = require("../_util/os.js");
    exports.SEP = os_js_1.isWindows ? "\\" : "/";
    exports.SEP_PATTERN = os_js_1.isWindows ? /[\\/]+/ : /\/+/;
});
