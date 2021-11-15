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
        define(["require", "exports", "deno.ns", "../bytes/mod.js", "../testing/asserts.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.readRangeSync = exports.readRange = void 0;
    const denoShim = __importStar(require("deno.ns"));
    // Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
    const mod_js_1 = require("../bytes/mod.js");
    const asserts_js_1 = require("../testing/asserts.js");
    const DEFAULT_BUFFER_SIZE = 32 * 1024;
    /**
     * Read a range of bytes from a file or other resource that is readable and
     * seekable.  The range start and end are inclusive of the bytes within that
     * range.
     *
     * ```ts
     * import { assertEquals } from "../testing/asserts.ts";
     * import { readRange } from "./files.ts";
     *
     * // Read the first 10 bytes of a file
     * const file = await Deno.open("example.txt", { read: true });
     * const bytes = await readRange(file, { start: 0, end: 9 });
     * assertEquals(bytes.length, 10);
     * ```
     */
    async function readRange(r, range) {
        // byte ranges are inclusive, so we have to add one to the end
        let length = range.end - range.start + 1;
        (0, asserts_js_1.assert)(length > 0, "Invalid byte range was passed.");
        await r.seek(range.start, denoShim.Deno.SeekMode.Start);
        const result = new Uint8Array(length);
        let off = 0;
        while (length) {
            const p = new Uint8Array(Math.min(length, DEFAULT_BUFFER_SIZE));
            const nread = await r.read(p);
            (0, asserts_js_1.assert)(nread !== null, "Unexpected EOF reach while reading a range.");
            (0, asserts_js_1.assert)(nread > 0, "Unexpected read of 0 bytes while reading a range.");
            (0, mod_js_1.copy)(p, result, off);
            off += nread;
            length -= nread;
            (0, asserts_js_1.assert)(length >= 0, "Unexpected length remaining after reading range.");
        }
        return result;
    }
    exports.readRange = readRange;
    /**
     * Read a range of bytes synchronously from a file or other resource that is
     * readable and seekable.  The range start and end are inclusive of the bytes
     * within that range.
     *
     * ```ts
     * import { assertEquals } from "../testing/asserts.ts";
     * import { readRangeSync } from "./files.ts";
     *
     * // Read the first 10 bytes of a file
     * const file = Deno.openSync("example.txt", { read: true });
     * const bytes = readRangeSync(file, { start: 0, end: 9 });
     * assertEquals(bytes.length, 10);
     * ```
     */
    function readRangeSync(r, range) {
        // byte ranges are inclusive, so we have to add one to the end
        let length = range.end - range.start + 1;
        (0, asserts_js_1.assert)(length > 0, "Invalid byte range was passed.");
        r.seekSync(range.start, denoShim.Deno.SeekMode.Start);
        const result = new Uint8Array(length);
        let off = 0;
        while (length) {
            const p = new Uint8Array(Math.min(length, DEFAULT_BUFFER_SIZE));
            const nread = r.readSync(p);
            (0, asserts_js_1.assert)(nread !== null, "Unexpected EOF reach while reading a range.");
            (0, asserts_js_1.assert)(nread > 0, "Unexpected read of 0 bytes while reading a range.");
            (0, mod_js_1.copy)(p, result, off);
            off += nread;
            length -= nread;
            (0, asserts_js_1.assert)(length >= 0, "Unexpected length remaining after reading range.");
        }
        return result;
    }
    exports.readRangeSync = readRangeSync;
});
