(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.equals = exports.equalsSimd = exports.equalsNaive = void 0;
    /** Check whether binary arrays are equal to each other using 8-bit comparisons.
     * @private
     * @param a first array to check equality
     * @param b second array to check equality
     */
    function equalsNaive(a, b) {
        if (a.length !== b.length)
            return false;
        for (let i = 0; i < b.length; i++) {
            if (a[i] !== b[i])
                return false;
        }
        return true;
    }
    exports.equalsNaive = equalsNaive;
    /** Check whether binary arrays are equal to each other using 32-bit comparisons.
     * @private
     * @param a first array to check equality
     * @param b second array to check equality
     */
    function equalsSimd(a, b) {
        if (a.length !== b.length)
            return false;
        const len = a.length;
        const compressable = Math.floor(len / 4);
        const compressedA = new Uint32Array(a.buffer, 0, compressable);
        const compressedB = new Uint32Array(b.buffer, 0, compressable);
        for (let i = compressable * 4; i < len; i++) {
            if (a[i] !== b[i])
                return false;
        }
        for (let i = 0; i < compressedA.length; i++) {
            if (compressedA[i] !== compressedB[i])
                return false;
        }
        return true;
    }
    exports.equalsSimd = equalsSimd;
    /** Check whether binary arrays are equal to each other.
     * @param a first array to check equality
     * @param b second array to check equality
     */
    function equals(a, b) {
        if (a.length < 1000)
            return equalsNaive(a, b);
        return equalsSimd(a, b);
    }
    exports.equals = equals;
});
