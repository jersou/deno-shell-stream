(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../operators/run.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CloseRes = exports.close = void 0;
    const run_js_1 = require("../operators/run.js");
    const close = (opt = { processes: "AWAIT" }) => async (shellStream) => {
        const out = [];
        // consume the generator
        for await (const line of shellStream.generator) {
            out.push(line);
        }
        if (opt.processes === "AWAIT") {
            for (const stream of shellStream.parents) {
                if (stream.process && !stream.processStatus) {
                    try {
                        stream.process.stdin.close();
                    }
                    catch (_e) {
                        // ignore error
                    }
                    try {
                        stream.process.stdout.close();
                    }
                    catch (_e) {
                        // ignore error
                    }
                    try {
                        stream.processStatus = await stream.process.status();
                    }
                    catch (_) {
                        // ignore error
                    }
                    try {
                        stream.process.close();
                    }
                    catch (_) {
                        // ignore error
                    }
                }
            }
        }
        else if (opt.processes === "KILL") {
            for (const stream of shellStream.parents) {
                if (stream.process && !stream.processStatus) {
                    try {
                        stream.process.kill("SIGINT");
                        stream.process.kill("SIGKILL");
                    }
                    catch (_e) {
                        // ignore error
                    }
                    stream.processStatus = await stream.process.status();
                    (0, run_js_1.closeProcess)(stream.process);
                }
            }
        }
        for (const stream of shellStream.parents) {
            for await (const _line of stream.generator) {
                // ignore stream
            }
            if (stream.file) {
                try {
                    stream.file.close();
                }
                catch (_e) {
                    // ignore error
                }
            }
        }
        const statuses = shellStream.parents.map((stream) => {
            return (stream.processStatus && {
                ...stream.processStatus,
                cmd: stream.processCmd,
            });
        });
        const success = !statuses.some((s) => s && !s.success);
        return new CloseRes(success, statuses, out);
    };
    exports.close = close;
    class CloseRes {
        constructor(success, statuses, out) {
            Object.defineProperty(this, "success", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: success
            });
            Object.defineProperty(this, "statuses", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: statuses
            });
            Object.defineProperty(this, "out", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: out
            });
        }
        tostring() {
            return this.out.join("\n");
        }
    }
    exports.CloseRes = CloseRes;
});
