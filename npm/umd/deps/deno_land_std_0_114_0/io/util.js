(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "deno.ns", "../_util/assert.js", "../streams/conversion.js", "./files.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.readRangeSync = exports.readRange = exports.copy = exports.iterSync = exports.iter = exports.writeAllSync = exports.writeAll = exports.readAllSync = exports.readAll = exports.sliceLongToBytes = exports.readLong = exports.readInt = exports.readShort = exports.copyN = void 0;
    const tslib_1 = require("tslib");
    const denoShim = (0, tslib_1.__importStar)(require("deno.ns"));
    // Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
    const assert_js_1 = require("../_util/assert.js");
    const streams = (0, tslib_1.__importStar)(require("../streams/conversion.js"));
    const files = (0, tslib_1.__importStar)(require("./files.js"));
    const DEFAULT_BUFFER_SIZE = 32 * 1024;
    /**
     * Copy N size at the most. If read size is lesser than N, then returns nread
     * @param r Reader
     * @param dest Writer
     * @param size Read size
     */
    async function copyN(r, dest, size) {
        let bytesRead = 0;
        let buf = new Uint8Array(DEFAULT_BUFFER_SIZE);
        while (bytesRead < size) {
            if (size - bytesRead < DEFAULT_BUFFER_SIZE) {
                buf = new Uint8Array(size - bytesRead);
            }
            const result = await r.read(buf);
            const nread = result ?? 0;
            bytesRead += nread;
            if (nread > 0) {
                let n = 0;
                while (n < nread) {
                    n += await dest.write(buf.slice(n, nread));
                }
                (0, assert_js_1.assert)(n === nread, "could not write");
            }
            if (result === null) {
                break;
            }
        }
        return bytesRead;
    }
    exports.copyN = copyN;
    /**
     * Read big endian 16bit short from BufReader
     * @param buf
     */
    async function readShort(buf) {
        const high = await buf.readByte();
        if (high === null)
            return null;
        const low = await buf.readByte();
        if (low === null)
            throw new denoShim.Deno.errors.UnexpectedEof();
        return (high << 8) | low;
    }
    exports.readShort = readShort;
    /**
     * Read big endian 32bit integer from BufReader
     * @param buf
     */
    async function readInt(buf) {
        const high = await readShort(buf);
        if (high === null)
            return null;
        const low = await readShort(buf);
        if (low === null)
            throw new denoShim.Deno.errors.UnexpectedEof();
        return (high << 16) | low;
    }
    exports.readInt = readInt;
    const MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
    /**
     * Read big endian 64bit long from BufReader
     * @param buf
     */
    async function readLong(buf) {
        const high = await readInt(buf);
        if (high === null)
            return null;
        const low = await readInt(buf);
        if (low === null)
            throw new denoShim.Deno.errors.UnexpectedEof();
        const big = (BigInt(high) << 32n) | BigInt(low);
        // We probably should provide a similar API that returns BigInt values.
        if (big > MAX_SAFE_INTEGER) {
            throw new RangeError("Long value too big to be represented as a JavaScript number.");
        }
        return Number(big);
    }
    exports.readLong = readLong;
    /**
     * Slice number into 64bit big endian byte array
     * @param d The number to be sliced
     * @param dest The sliced array
     */
    function sliceLongToBytes(d, dest = new Array(8)) {
        let big = BigInt(d);
        for (let i = 0; i < 8; i++) {
            dest[7 - i] = Number(big & 0xffn);
            big >>= 8n;
        }
        return dest;
    }
    exports.sliceLongToBytes = sliceLongToBytes;
    /** @deprecated Use readAll from https://deno.land/std/streams/conversion.ts instead. */
    exports.readAll = streams.readAll;
    /** @deprecated Use readAllSync from https://deno.land/std/streams/conversion.ts instead. */
    exports.readAllSync = streams.readAllSync;
    /** @deprecated Use writeAll from https://deno.land/std/streams/conversion.ts instead. */
    exports.writeAll = streams.writeAll;
    /** @deprecated Use writeAllSync from https://deno.land/std/streams/conversion.ts instead. */
    exports.writeAllSync = streams.writeAllSync;
    /** @deprecated Use iterateReader from https://deno.land/std/streams/conversion.ts instead. */
    exports.iter = streams.iterateReader;
    /** @deprecated Use iterateReaderSync from https://deno.land/std/streams/conversion.ts instead. */
    exports.iterSync = streams.iterateReaderSync;
    /** @deprecated Use copy from https://deno.land/std/streams/conversion.ts instead. */
    exports.copy = streams.copy;
    /** @deprecated Use readRange from https://deno.land/std/io/files.ts instead. */
    exports.readRange = files.readRange;
    /** @deprecated Use readRangeSync from https://deno.land/std/io/files.ts instead. */
    exports.readRangeSync = files.readRangeSync;
});
