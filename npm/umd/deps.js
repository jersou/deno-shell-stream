(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./deps/deno_land_std_0_112_0/io/mod.js", "./deps/deno_land_std_0_112_0/path/mod.js", "./deps/deno_land_std_0_112_0/fmt/colors.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.yellow = exports.bgRed = exports.bgGreen = exports.bgBlue = exports.join = exports.basename = exports.readLines = exports.readerFromStreamReader = exports.copy = exports.Buffer = void 0;
    var mod_js_1 = require("./deps/deno_land_std_0_112_0/io/mod.js");
    Object.defineProperty(exports, "Buffer", { enumerable: true, get: function () { return mod_js_1.Buffer; } });
    Object.defineProperty(exports, "copy", { enumerable: true, get: function () { return mod_js_1.copy; } });
    Object.defineProperty(exports, "readerFromStreamReader", { enumerable: true, get: function () { return mod_js_1.readerFromStreamReader; } });
    Object.defineProperty(exports, "readLines", { enumerable: true, get: function () { return mod_js_1.readLines; } });
    var mod_js_2 = require("./deps/deno_land_std_0_112_0/path/mod.js");
    Object.defineProperty(exports, "basename", { enumerable: true, get: function () { return mod_js_2.basename; } });
    Object.defineProperty(exports, "join", { enumerable: true, get: function () { return mod_js_2.join; } });
    var colors_js_1 = require("./deps/deno_land_std_0_112_0/fmt/colors.js");
    Object.defineProperty(exports, "bgBlue", { enumerable: true, get: function () { return colors_js_1.bgBlue; } });
    Object.defineProperty(exports, "bgGreen", { enumerable: true, get: function () { return colors_js_1.bgGreen; } });
    Object.defineProperty(exports, "bgRed", { enumerable: true, get: function () { return colors_js_1.bgRed; } });
    Object.defineProperty(exports, "yellow", { enumerable: true, get: function () { return colors_js_1.yellow; } });
});
