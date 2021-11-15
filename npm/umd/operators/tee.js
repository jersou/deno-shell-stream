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
        define(["require", "exports", "deno.ns", "../shell_stream.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tee = void 0;
    const denoShim = __importStar(require("deno.ns"));
    const shell_stream_js_1 = require("../shell_stream.js");
    const tee = (outputPath) => (stream) => {
        const generator = (async function* () {
            stream.file = await denoShim.Deno.open(outputPath, {
                write: true,
                create: true,
            });
            const encoder = new TextEncoder();
            let start = true;
            for await (const line of stream.generator) {
                if (start) {
                    await denoShim.Deno.write(stream.file.rid, encoder.encode(line));
                    start = false;
                }
                else {
                    await denoShim.Deno.write(stream.file.rid, encoder.encode("\n" + line));
                }
                yield line;
            }
            stream.file.close();
        })();
        return shell_stream_js_1.ShellStream.builder(generator, stream);
    };
    exports.tee = tee;
});
