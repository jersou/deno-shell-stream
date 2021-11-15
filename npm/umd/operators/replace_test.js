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
        define(["require", "exports", "deno.ns", "../test_deps.js", "../shell_stream.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    const denoShim = __importStar(require("deno.ns"));
    const test_deps_js_1 = require("../test_deps.js");
    const shell_stream_js_1 = require("../shell_stream.js");
    denoShim.Deno.test("replace_str", async () => {
        const res = await (0, shell_stream_js_1.FromArray)(["line1", "line2"]).replace("in", "-").toArray();
        (0, test_deps_js_1.assertEquals)(res, ["l-e1", "l-e2"]);
    });
    denoShim.Deno.test("replace_regex", async () => {
        const res = await (0, shell_stream_js_1.FromArray)(["line1line", "line2line"])
            .replace(/in(e[0-9])/g, "aa_$1_bb")
            .toArray();
        (0, test_deps_js_1.assertEquals)(res, ["laa_e1_bbline", "laa_e2_bbline"]);
    });
    denoShim.Deno.test("replace_replacer", async () => {
        const replacer = (_match, v1) => v1;
        const res = await (0, shell_stream_js_1.FromArray)(["line1line", "line2line"])
            .replace(/in(e[0-9])/g, replacer)
            .toArray();
        (0, test_deps_js_1.assertEquals)(res, ["le1line", "le2line"]);
    });
});
