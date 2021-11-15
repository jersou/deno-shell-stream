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
        define(["require", "exports", "deno.ns", "../shell_stream.js", "../deps.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromFile = void 0;
    const denoShim = __importStar(require("deno.ns"));
    const shell_stream_js_1 = require("../shell_stream.js");
    const deps_js_1 = require("../deps.js");
    const fromFile = (path, opt) => () => {
        const generator = (async function* () {
            if (opt?.closeBeforeStreaming) {
                const fileContent = await denoShim.Deno.readTextFile(path);
                for await (const line of fileContent.split("\n")) {
                    yield line;
                }
            }
            else {
                const file = await denoShim.Deno.open(path);
                for await (const line of (0, deps_js_1.readLines)(file)) {
                    yield line;
                }
                file.close();
            }
        })();
        return shell_stream_js_1.ShellStream.builder(generator);
    };
    exports.fromFile = fromFile;
});
