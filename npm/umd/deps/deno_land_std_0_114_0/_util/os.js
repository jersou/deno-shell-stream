(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "deno.ns"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isWindows = exports.osType = void 0;
    const tslib_1 = require("tslib");
    const denoShim = (0, tslib_1.__importStar)(require("deno.ns"));
    exports.osType = (() => {
        // deno-lint-ignore no-explicit-any
        const { Deno } = ({ ...denoShim, ...globalThis });
        if (typeof Deno?.build?.os === "string") {
            return Deno.build.os;
        }
        // deno-lint-ignore no-explicit-any
        const { navigator } = ({ ...denoShim, ...globalThis });
        if (navigator?.appVersion?.includes?.("Win") ?? false) {
            return "windows";
        }
        return "linux";
    })();
    exports.isWindows = exports.osType === "windows";
});
