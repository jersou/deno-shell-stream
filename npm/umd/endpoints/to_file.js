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
    exports.toFile = void 0;
    const tslib_1 = require("tslib");
    const denoShim = (0, tslib_1.__importStar)(require("deno.ns"));
    const toFile = (outputPath) => async (stream) => {
        const closeRes = await stream.close();
        await denoShim.Deno.writeTextFile(outputPath, closeRes.out.join("\n"));
        return closeRes;
    };
    exports.toFile = toFile;
});
