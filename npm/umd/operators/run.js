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
    exports.closeProcess = exports.parseCmdString = exports.run = void 0;
    const denoShim = __importStar(require("deno.ns"));
    const shell_stream_js_1 = require("../shell_stream.js");
    const deps_js_1 = require("../deps.js");
    const run = (cmdOrStr, opt) => (stream) => {
        const generator = (async function* () {
            stream.processCmd = parseCmdString(cmdOrStr);
            stream.process = denoShim.Deno.run({
                cmd: stream.processCmd,
                ...opt,
                stdout: opt?.stdout || (opt?.streamStdErr ? "inherit" : "piped"),
                stderr: opt?.stderr || (opt?.streamStdErr ? "piped" : "inherit"),
                stdin: "piped",
            });
            shell_stream_js_1.ShellStream.incProcessCount();
            redirectGeneratorToStdin(stream).then();
            (async () => {
                stream.processStatus = await stream.process.status();
                shell_stream_js_1.ShellStream.incProcessDone();
                closeProcess(stream.process);
            })().then();
            try {
                for await (const line of (0, deps_js_1.readLines)(opt?.streamStdErr ? stream.process.stderr : stream.process.stdout)) {
                    yield line;
                }
            }
            catch (_e) {
                // ignore error
            }
            if (opt?.throwIfRunFail && !stream.processStatus.success) {
                throw new Error(`The process ${stream.processCmd[0]} exit error ${stream.processStatus.code}`);
            }
            if (opt?.exitCodeIfRunFail !== undefined) {
                denoShim.Deno.exit(opt?.exitCodeIfRunFail);
            }
        })();
        return shell_stream_js_1.ShellStream.builder(generator, stream);
    };
    exports.run = run;
    async function redirectGeneratorToStdin(stream) {
        const textEncoder = new TextEncoder();
        for await (const line of stream.generator) {
            try {
                await stream.process.stdin.write(textEncoder.encode(line + "\n"));
            }
            catch (_e) {
                break;
            }
        }
        try {
            stream.process.stdin.close();
        }
        catch (_e) {
            // ignore error
        }
    }
    function parseCmdString(cmdOrStr) {
        return cmdOrStr instanceof Array ? cmdOrStr : cmdOrStr
            .trim()
            .match(/"(\\"|[^"])*"|'(\\'|[^'])*'|[^ "']+/g)
            .map((p) => p.match(/^"((\\"|[^"])*)"$/)
            ? p.replace(/^"((\\"|[^"])*)"$/, "$1")
            : p.match(/^'((\\'|[^'])*)'$/)
                ? p.replace(/^'((\\'|[^'])*)'$/, "$1")
                : p);
    }
    exports.parseCmdString = parseCmdString;
    function closeProcess(process) {
        try {
            process.stdin.close();
        }
        catch (_e) {
            // ignore error
        }
        try {
            process.stdout.close();
        }
        catch (_e) {
            // ignore error
        }
        try {
            process.stderr.close();
        }
        catch (_e) {
            // ignore error
        }
        try {
            process.close();
        }
        catch (_e) {
            // ignore error
        }
    }
    exports.closeProcess = closeProcess;
});
