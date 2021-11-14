(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../streams/conversion.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.copy = exports.iterateReaderSync = exports.iterateReader = exports.writeAllSync = exports.writeAll = exports.readAllSync = exports.readAll = exports.readableStreamFromReader = exports.readableStreamFromIterable = exports.writableStreamFromWriter = exports.readerFromStreamReader = exports.writerFromStreamWriter = exports.readerFromIterable = void 0;
    const conversion_js_1 = require("../streams/conversion.js");
    /** @deprecated This function has been moved to `/streams/conversion.ts`. */
    exports.readerFromIterable = conversion_js_1.readerFromIterable;
    /** @deprecated This function has been moved to `/streams/conversion.ts`. */
    exports.writerFromStreamWriter = conversion_js_1.writerFromStreamWriter;
    /** @deprecated This function has been moved to `/streams/conversion.ts`. */
    exports.readerFromStreamReader = conversion_js_1.readerFromStreamReader;
    /** @deprecated This function has been moved to `/streams/conversion.ts`. */
    exports.writableStreamFromWriter = conversion_js_1.writableStreamFromWriter;
    /** @deprecated This function has been moved to `/streams/conversion.ts`. */
    exports.readableStreamFromIterable = conversion_js_1.readableStreamFromIterable;
    /** @deprecated This function has been moved to `/streams/conversion.ts`. */
    exports.readableStreamFromReader = conversion_js_1.readableStreamFromReader;
    /** @deprecated This function has been moved to `/streams/conversion.ts`. */
    exports.readAll = conversion_js_1.readAll;
    /** @deprecated This function has been moved to `/streams/conversion.ts`. */
    exports.readAllSync = conversion_js_1.readAllSync;
    /** @deprecated This function has been moved to `/streams/conversion.ts`. */
    exports.writeAll = conversion_js_1.writeAll;
    /** @deprecated This function has been moved to `/streams/conversion.ts`. */
    exports.writeAllSync = conversion_js_1.writeAllSync;
    /** @deprecated This function has been moved to `/streams/conversion.ts`. */
    exports.iterateReader = conversion_js_1.iterateReader;
    /** @deprecated This function has been moved to `/streams/conversion.ts`. */
    exports.iterateReaderSync = conversion_js_1.iterateReaderSync;
    /** @deprecated This function has been moved to `/streams/conversion.ts`. */
    exports.copy = conversion_js_1.copy;
});
