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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "deno.ns"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isWindows = exports.osType = void 0;
    const denoShim = __importStar(require("deno.ns"));
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
