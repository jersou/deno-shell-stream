// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./equals.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.equals = exports.contains = exports.copy = exports.includes = exports.concat = exports.repeat = exports.endsWith = exports.startsWith = exports.lastIndexOf = exports.indexOf = void 0;
    /** Returns the index of the first occurrence of the pattern array in the source
     * array, or -1 if it is not present. */
    function indexOf(source, pattern, fromIndex = 0) {
        if (fromIndex >= source.length) {
            return -1;
        }
        if (fromIndex < 0) {
            fromIndex = Math.max(0, source.length + fromIndex);
        }
        const s = pattern[0];
        for (let i = fromIndex; i < source.length; i++) {
            if (source[i] !== s)
                continue;
            const pin = i;
            let matched = 1;
            let j = i;
            while (matched < pattern.length) {
                j++;
                if (source[j] !== pattern[j - pin]) {
                    break;
                }
                matched++;
            }
            if (matched === pattern.length) {
                return pin;
            }
        }
        return -1;
    }
    exports.indexOf = indexOf;
    /** Find last index of binary pattern from source. If not found, then return -1.
     * @param source source array
     * @param pat pattern to find in source array
     * @param start the index to start looking in the source
     */
    function lastIndexOf(source, pat, start = source.length - 1) {
        if (start < 0) {
            return -1;
        }
        if (start >= source.length) {
            start = source.length - 1;
        }
        const e = pat[pat.length - 1];
        for (let i = start; i >= 0; i--) {
            if (source[i] !== e)
                continue;
            const pin = i;
            let matched = 1;
            let j = i;
            while (matched < pat.length) {
                j--;
                if (source[j] !== pat[pat.length - 1 - (pin - j)]) {
                    break;
                }
                matched++;
            }
            if (matched === pat.length) {
                return pin - pat.length + 1;
            }
        }
        return -1;
    }
    exports.lastIndexOf = lastIndexOf;
    /** Check whether binary array starts with prefix.
     * @param source source array
     * @param prefix prefix array to check in source
     */
    function startsWith(source, prefix) {
        for (let i = 0, max = prefix.length; i < max; i++) {
            if (source[i] !== prefix[i])
                return false;
        }
        return true;
    }
    exports.startsWith = startsWith;
    /** Check whether binary array ends with suffix.
     * @param source source array
     * @param suffix suffix array to check in source
     */
    function endsWith(source, suffix) {
        for (let srci = source.length - 1, sfxi = suffix.length - 1; sfxi >= 0; srci--, sfxi--) {
            if (source[srci] !== suffix[sfxi])
                return false;
        }
        return true;
    }
    exports.endsWith = endsWith;
    /** Repeat bytes. returns a new byte slice consisting of `count` copies of `b`.
     * @param origin The origin bytes
     * @param count The count you want to repeat.
     * @throws `RangeError` When count is negative
     */
    function repeat(origin, count) {
        if (count === 0) {
            return new Uint8Array();
        }
        if (count < 0) {
            throw new RangeError("bytes: negative repeat count");
        }
        else if ((origin.length * count) / count !== origin.length) {
            throw new Error("bytes: repeat count causes overflow");
        }
        const int = Math.floor(count);
        if (int !== count) {
            throw new Error("bytes: repeat count must be an integer");
        }
        const nb = new Uint8Array(origin.length * count);
        let bp = copy(origin, nb);
        for (; bp < nb.length; bp *= 2) {
            copy(nb.slice(0, bp), nb, bp);
        }
        return nb;
    }
    exports.repeat = repeat;
    /** Concatenate multiple binary arrays and return new one.
     * @param buf binary arrays to concatenate
     */
    function concat(...buf) {
        let length = 0;
        for (const b of buf) {
            length += b.length;
        }
        const output = new Uint8Array(length);
        let index = 0;
        for (const b of buf) {
            output.set(b, index);
            index += b.length;
        }
        return output;
    }
    exports.concat = concat;
    /** Determines whether the source array includes the pattern array. */
    function includes(source, pattern, fromIndex = 0) {
        return indexOf(source, pattern, fromIndex) !== -1;
    }
    exports.includes = includes;
    exports.contains = includes;
    /**
     * Copy bytes from one Uint8Array to another.  Bytes from `src` which don't fit
     * into `dst` will not be copied.
     *
     * @param src Source byte array
     * @param dst Destination byte array
     * @param off Offset into `dst` at which to begin writing values from `src`.
     * @return number of bytes copied
     */
    function copy(src, dst, off = 0) {
        off = Math.max(0, Math.min(off, dst.byteLength));
        const dstBytesAvailable = dst.byteLength - off;
        if (src.byteLength > dstBytesAvailable) {
            src = src.subarray(0, dstBytesAvailable);
        }
        dst.set(src, off);
        return src.byteLength;
    }
    exports.copy = copy;
    var equals_js_1 = require("./equals.js");
    Object.defineProperty(exports, "equals", { enumerable: true, get: function () { return equals_js_1.equals; } });
});