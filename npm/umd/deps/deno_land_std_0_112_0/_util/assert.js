// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assert = exports.DenoStdInternalError = void 0;
    class DenoStdInternalError extends Error {
        constructor(message) {
            super(message);
            this.name = "DenoStdInternalError";
        }
    }
    exports.DenoStdInternalError = DenoStdInternalError;
    /** Make an assertion, if not `true`, then throw. */
    function assert(expr, msg = "") {
        if (!expr) {
            throw new DenoStdInternalError(msg);
        }
    }
    exports.assert = assert;
});
