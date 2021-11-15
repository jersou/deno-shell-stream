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
    denoShim.Deno.test("sponge", async () => {
        const tmpPath = await denoShim.Deno.makeTempFile();
        await (0, shell_stream_js_1.FromArray)(["line1", "line2", "line3", "line4"]).toFile(tmpPath);
        await (0, shell_stream_js_1.FromFile)(tmpPath, { closeBeforeStreaming: true })
            .map((line) => "mod-> " + line)
            .sponge()
            .tee(tmpPath)
            .close();
        const res = await (0, shell_stream_js_1.FromFile)(tmpPath).toArray();
        await denoShim.Deno.remove(tmpPath);
        (0, test_deps_js_1.assertEquals)(res, [
            "mod-> line1",
            "mod-> line2",
            "mod-> line3",
            "mod-> line4",
        ]);
    });
});
