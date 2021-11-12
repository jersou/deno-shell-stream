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
    exports.pipe = void 0;
    const pipe = (...operators) => (shellStream) => {
        let current = shellStream;
        for (const operator of operators) {
            current = operator(current);
        }
        return current;
    };
    exports.pipe = pipe;
});
