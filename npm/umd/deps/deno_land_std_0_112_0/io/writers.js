// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
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
    exports.StringWriter = void 0;
    const decoder = new TextDecoder();
    /** Writer utility for buffering string chunks */
    class StringWriter {
        constructor(base = "") {
            Object.defineProperty(this, "base", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: base
            });
            Object.defineProperty(this, "chunks", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: []
            });
            Object.defineProperty(this, "byteLength", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: 0
            });
            Object.defineProperty(this, "cache", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            const c = new TextEncoder().encode(base);
            this.chunks.push(c);
            this.byteLength += c.byteLength;
        }
        write(p) {
            return Promise.resolve(this.writeSync(p));
        }
        writeSync(p) {
            this.chunks.push(p);
            this.byteLength += p.byteLength;
            this.cache = undefined;
            return p.byteLength;
        }
        toString() {
            if (this.cache) {
                return this.cache;
            }
            const buf = new Uint8Array(this.byteLength);
            let offs = 0;
            for (const chunk of this.chunks) {
                buf.set(chunk, offs);
                offs += chunk.byteLength;
            }
            this.cache = decoder.decode(buf);
            return this.cache;
        }
    }
    exports.StringWriter = StringWriter;
});
