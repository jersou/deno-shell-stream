(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./operators/log.js", "./endpoints/to_file.js", "./operators/run.js", "./operators/grep.js", "./operators/timestamp.js", "./operators/tap.js", "./operators/replace.js", "./operators/map.js", "./operators/filter.js", "./operators/cut.js", "./endpoints/close.js", "./endpoints/to_string.js", "./endpoints/to_array.js", "./operators/pipe.js", "./operators/tee.js", "./startpoints/from.js", "./startpoints/from_file.js", "./startpoints/from_array.js", "./startpoints/from_run.js", "./startpoints/from_string.js", "./operators/tail.js", "./operators/head.js", "./operators/logWithTimestamp.js", "./endpoints/success.js", "./operators/sponge.js", "./startpoints/from_dir.js", "./startpoints/from_walk.js", "./operators/sort.js", "./operators/uniq.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FromString = exports.FromArray = exports.FromRun = exports.FromWalk = exports.FromDir = exports.FromFile = exports.From = exports.Pipe = exports.ShellStream = void 0;
    const log_js_1 = require("./operators/log.js");
    const to_file_js_1 = require("./endpoints/to_file.js");
    const run_js_1 = require("./operators/run.js");
    const grep_js_1 = require("./operators/grep.js");
    const timestamp_js_1 = require("./operators/timestamp.js");
    const tap_js_1 = require("./operators/tap.js");
    const replace_js_1 = require("./operators/replace.js");
    const map_js_1 = require("./operators/map.js");
    const filter_js_1 = require("./operators/filter.js");
    const cut_js_1 = require("./operators/cut.js");
    const close_js_1 = require("./endpoints/close.js");
    const to_string_js_1 = require("./endpoints/to_string.js");
    const to_array_js_1 = require("./endpoints/to_array.js");
    const pipe_js_1 = require("./operators/pipe.js");
    const tee_js_1 = require("./operators/tee.js");
    const from_js_1 = require("./startpoints/from.js");
    const from_file_js_1 = require("./startpoints/from_file.js");
    const from_array_js_1 = require("./startpoints/from_array.js");
    const from_run_js_1 = require("./startpoints/from_run.js");
    const from_string_js_1 = require("./startpoints/from_string.js");
    const tail_js_1 = require("./operators/tail.js");
    const head_js_1 = require("./operators/head.js");
    const logWithTimestamp_js_1 = require("./operators/logWithTimestamp.js");
    const success_js_1 = require("./endpoints/success.js");
    const sponge_js_1 = require("./operators/sponge.js");
    const from_dir_js_1 = require("./startpoints/from_dir.js");
    const from_walk_js_1 = require("./startpoints/from_walk.js");
    const sort_js_1 = require("./operators/sort.js");
    const uniq_js_1 = require("./operators/uniq.js");
    class ShellStream {
        constructor(parents, generator) {
            Object.defineProperty(this, "parents", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: parents
            });
            Object.defineProperty(this, "generator", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: generator
            });
            Object.defineProperty(this, "process", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "processStatus", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "processCmd", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "file", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "run", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: (cmd, opt) => (0, run_js_1.run)(cmd, opt)(this)
            });
            Object.defineProperty(this, "toFile", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: (outputPath) => (0, to_file_js_1.toFile)(outputPath)(this)
            });
            Object.defineProperty(this, "tee", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: (outputPath) => (0, tee_js_1.tee)(outputPath)(this)
            });
            Object.defineProperty(this, "log", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: (transform) => (0, log_js_1.log)(transform)(this)
            });
            Object.defineProperty(this, "logWithTimestamp", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: () => (0, logWithTimestamp_js_1.logWithTimestamp)()(this)
            });
            Object.defineProperty(this, "grep", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: (regex) => (0, grep_js_1.grep)(regex)(this)
            });
            Object.defineProperty(this, "timestamp", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: () => (0, timestamp_js_1.timestamp)()(this)
            });
            Object.defineProperty(this, "tap", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: (tapFunction) => (0, tap_js_1.tap)(tapFunction)(this)
            });
            Object.defineProperty(this, "replace", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: (v, r) => (0, replace_js_1.replace)(v, r)(this)
            });
            Object.defineProperty(this, "map", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: (mapFunction) => (0, map_js_1.map)(mapFunction)(this)
            });
            Object.defineProperty(this, "filter", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: (filterFunction) => (0, filter_js_1.filter)(filterFunction)(this)
            });
            Object.defineProperty(this, "cut", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: (delim, i, sep = " ") => (0, cut_js_1.cut)(delim, i, sep)(this)
            });
            Object.defineProperty(this, "head", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: (count = 1) => (0, head_js_1.head)(count)(this)
            });
            Object.defineProperty(this, "tail", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: (count = 1) => (0, tail_js_1.tail)(count)(this)
            });
            Object.defineProperty(this, "sponge", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: () => (0, sponge_js_1.sponge)()(this)
            });
            Object.defineProperty(this, "sort", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: () => (0, sort_js_1.sort)()(this)
            });
            Object.defineProperty(this, "uniq", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: () => (0, uniq_js_1.uniq)()(this)
            });
            Object.defineProperty(this, "pipe", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: (...operators) => (0, pipe_js_1.pipe)(...operators)(this)
            });
            // EndOperators
            Object.defineProperty(this, "close", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: async (opt = { processes: "AWAIT" }) => await (0, close_js_1.close)(opt)(this)
            });
            Object.defineProperty(this, "toString", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: async () => await (0, to_string_js_1.toString)()(this)
            });
            Object.defineProperty(this, "toArray", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: async () => await (0, to_array_js_1.toArray)()(this)
            });
            Object.defineProperty(this, "success", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: async () => await (0, success_js_1.success)()(this)
            });
        }
        static builder(generator, inputStream) {
            return new ShellStream(inputStream ? [...inputStream.parents, inputStream] : [], generator);
        }
        static empty() {
            const emptyGenerator = (async function* () { })();
            return new ShellStream([], emptyGenerator);
        }
        static subscribeProcessEvent(listener) {
            ShellStream.processEventListener.push(listener);
        }
        static unsubscribeProcessEvent(listener) {
            ShellStream.processEventListener = ShellStream.processEventListener.filter((l) => l !== listener);
        }
        static sendProcessEvent() {
            ShellStream.processEventListener.forEach((listener) => listener({
                processCount: ShellStream.processCount,
                processDone: ShellStream.processDone,
            }));
        }
        static incProcessCount() {
            ShellStream.processCount++;
            ShellStream.sendProcessEvent();
        }
        static incProcessDone() {
            ShellStream.processDone++;
            ShellStream.sendProcessEvent();
        }
    }
    exports.ShellStream = ShellStream;
    Object.defineProperty(ShellStream, "from", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (iterable) => (0, from_js_1.from)(iterable)()
    });
    Object.defineProperty(ShellStream, "fromFile", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (path, opt) => (0, from_file_js_1.fromFile)(path, opt)()
    });
    Object.defineProperty(ShellStream, "fromDir", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (path) => (0, from_dir_js_1.fromDir)(path)()
    });
    Object.defineProperty(ShellStream, "fromWalk", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (path, opt) => (0, from_walk_js_1.fromWalk)(path, opt)()
    });
    Object.defineProperty(ShellStream, "fromArray", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (lines) => (0, from_array_js_1.fromArray)(lines)()
    });
    Object.defineProperty(ShellStream, "fromString", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (line) => (0, from_string_js_1.fromString)(line)()
    });
    Object.defineProperty(ShellStream, "fromRun", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (cmd, opt) => (0, from_run_js_1.fromRun)(cmd, opt)()
    });
    Object.defineProperty(ShellStream, "pipe", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (...op) => (0, pipe_js_1.pipe)(...op)(ShellStream.empty())
    });
    Object.defineProperty(ShellStream, "processCount", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
    });
    Object.defineProperty(ShellStream, "processDone", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
    });
    Object.defineProperty(ShellStream, "processEventListener", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: []
    });
    exports.Pipe = ShellStream.pipe;
    exports.From = ShellStream.from;
    exports.FromFile = ShellStream.fromFile;
    exports.FromDir = ShellStream.fromDir;
    exports.FromWalk = ShellStream.fromWalk;
    exports.FromRun = ShellStream.fromRun;
    exports.FromArray = ShellStream.fromArray;
    exports.FromString = ShellStream.fromString;
});
