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
    exports.toIterable = void 0;
    const toIterable = () => (stream) => {
        return (async function* () {
            for await (const line of stream.generator) {
                yield line;
            }
            await stream.close();
        })();
    };
    exports.toIterable = toIterable;
});
