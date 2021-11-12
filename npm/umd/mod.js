(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./shell_stream.js", "./startpoints/from_array.js", "./startpoints/from_run.js", "./startpoints/from_file.js", "./startpoints/from_string.js", "./operators/cut.js", "./operators/filter.js", "./operators/grep.js", "./operators/log.js", "./operators/map.js", "./operators/pipe.js", "./operators/replace.js", "./operators/run.js", "./operators/sponge.js", "./operators/tap.js", "./operators/tee.js", "./operators/timestamp.js", "./endpoints/close.js", "./endpoints/success.js", "./endpoints/to_array.js", "./endpoints/to_file.js", "./endpoints/to_string.js", "./sanitize.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sanitize = exports.toString = exports.toFile = exports.toArray = exports.success = exports.close = exports.timestamp = exports.tee = exports.tap = exports.sponge = exports.run = exports.parseCmdString = exports.closeProcess = exports.replace = exports.pipe = exports.map = exports.log = exports.grep = exports.filter = exports.cut = exports.fromString = exports.fromFile = exports.fromRun = exports.fromArray = exports.ShellStream = exports.Pipe = exports.FromString = exports.FromRun = exports.FromFile = exports.FromArray = void 0;
    var shell_stream_js_1 = require("./shell_stream.js");
    Object.defineProperty(exports, "FromArray", { enumerable: true, get: function () { return shell_stream_js_1.FromArray; } });
    Object.defineProperty(exports, "FromFile", { enumerable: true, get: function () { return shell_stream_js_1.FromFile; } });
    Object.defineProperty(exports, "FromRun", { enumerable: true, get: function () { return shell_stream_js_1.FromRun; } });
    Object.defineProperty(exports, "FromString", { enumerable: true, get: function () { return shell_stream_js_1.FromString; } });
    Object.defineProperty(exports, "Pipe", { enumerable: true, get: function () { return shell_stream_js_1.Pipe; } });
    Object.defineProperty(exports, "ShellStream", { enumerable: true, get: function () { return shell_stream_js_1.ShellStream; } });
    var from_array_js_1 = require("./startpoints/from_array.js");
    Object.defineProperty(exports, "fromArray", { enumerable: true, get: function () { return from_array_js_1.fromArray; } });
    var from_run_js_1 = require("./startpoints/from_run.js");
    Object.defineProperty(exports, "fromRun", { enumerable: true, get: function () { return from_run_js_1.fromRun; } });
    var from_file_js_1 = require("./startpoints/from_file.js");
    Object.defineProperty(exports, "fromFile", { enumerable: true, get: function () { return from_file_js_1.fromFile; } });
    var from_string_js_1 = require("./startpoints/from_string.js");
    Object.defineProperty(exports, "fromString", { enumerable: true, get: function () { return from_string_js_1.fromString; } });
    var cut_js_1 = require("./operators/cut.js");
    Object.defineProperty(exports, "cut", { enumerable: true, get: function () { return cut_js_1.cut; } });
    var filter_js_1 = require("./operators/filter.js");
    Object.defineProperty(exports, "filter", { enumerable: true, get: function () { return filter_js_1.filter; } });
    var grep_js_1 = require("./operators/grep.js");
    Object.defineProperty(exports, "grep", { enumerable: true, get: function () { return grep_js_1.grep; } });
    var log_js_1 = require("./operators/log.js");
    Object.defineProperty(exports, "log", { enumerable: true, get: function () { return log_js_1.log; } });
    var map_js_1 = require("./operators/map.js");
    Object.defineProperty(exports, "map", { enumerable: true, get: function () { return map_js_1.map; } });
    var pipe_js_1 = require("./operators/pipe.js");
    Object.defineProperty(exports, "pipe", { enumerable: true, get: function () { return pipe_js_1.pipe; } });
    var replace_js_1 = require("./operators/replace.js");
    Object.defineProperty(exports, "replace", { enumerable: true, get: function () { return replace_js_1.replace; } });
    var run_js_1 = require("./operators/run.js");
    Object.defineProperty(exports, "closeProcess", { enumerable: true, get: function () { return run_js_1.closeProcess; } });
    Object.defineProperty(exports, "parseCmdString", { enumerable: true, get: function () { return run_js_1.parseCmdString; } });
    Object.defineProperty(exports, "run", { enumerable: true, get: function () { return run_js_1.run; } });
    var sponge_js_1 = require("./operators/sponge.js");
    Object.defineProperty(exports, "sponge", { enumerable: true, get: function () { return sponge_js_1.sponge; } });
    var tap_js_1 = require("./operators/tap.js");
    Object.defineProperty(exports, "tap", { enumerable: true, get: function () { return tap_js_1.tap; } });
    var tee_js_1 = require("./operators/tee.js");
    Object.defineProperty(exports, "tee", { enumerable: true, get: function () { return tee_js_1.tee; } });
    var timestamp_js_1 = require("./operators/timestamp.js");
    Object.defineProperty(exports, "timestamp", { enumerable: true, get: function () { return timestamp_js_1.timestamp; } });
    var close_js_1 = require("./endpoints/close.js");
    Object.defineProperty(exports, "close", { enumerable: true, get: function () { return close_js_1.close; } });
    var success_js_1 = require("./endpoints/success.js");
    Object.defineProperty(exports, "success", { enumerable: true, get: function () { return success_js_1.success; } });
    var to_array_js_1 = require("./endpoints/to_array.js");
    Object.defineProperty(exports, "toArray", { enumerable: true, get: function () { return to_array_js_1.toArray; } });
    var to_file_js_1 = require("./endpoints/to_file.js");
    Object.defineProperty(exports, "toFile", { enumerable: true, get: function () { return to_file_js_1.toFile; } });
    var to_string_js_1 = require("./endpoints/to_string.js");
    Object.defineProperty(exports, "toString", { enumerable: true, get: function () { return to_string_js_1.toString; } });
    var sanitize_js_1 = require("./sanitize.js");
    Object.defineProperty(exports, "sanitize", { enumerable: true, get: function () { return sanitize_js_1.sanitize; } });
});
