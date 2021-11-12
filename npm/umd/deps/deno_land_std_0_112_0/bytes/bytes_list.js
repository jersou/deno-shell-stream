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
    exports.BytesList = void 0;
    /**
     * An abstraction of multiple Uint8Arrays
     */
    class BytesList {
        constructor() {
            Object.defineProperty(this, "len", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: 0
            });
            Object.defineProperty(this, "chunks", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: []
            });
        }
        /**
         * Total size of bytes
         */
        size() {
            return this.len;
        }
        /**
         * Push bytes with given offset infos
         */
        add(value, start = 0, end = value.byteLength) {
            if (value.byteLength === 0 || end - start === 0) {
                return;
            }
            checkRange(start, end, value.byteLength);
            this.chunks.push({
                value,
                end,
                start,
                offset: this.len,
            });
            this.len += end - start;
        }
        /**
         * Drop head `n` bytes.
         */
        shift(n) {
            if (n === 0) {
                return;
            }
            if (this.len <= n) {
                this.chunks = [];
                this.len = 0;
                return;
            }
            const idx = this.getChunkIndex(n);
            this.chunks.splice(0, idx);
            const [chunk] = this.chunks;
            if (chunk) {
                const diff = n - chunk.offset;
                chunk.start += diff;
            }
            let offset = 0;
            for (const chunk of this.chunks) {
                chunk.offset = offset;
                offset += chunk.end - chunk.start;
            }
            this.len = offset;
        }
        /**
         * Find chunk index in which `pos` locates by binary-search
         * returns -1 if out of range
         */
        getChunkIndex(pos) {
            let max = this.chunks.length;
            let min = 0;
            while (true) {
                const i = min + Math.floor((max - min) / 2);
                if (i < 0 || this.chunks.length <= i) {
                    return -1;
                }
                const { offset, start, end } = this.chunks[i];
                const len = end - start;
                if (offset <= pos && pos < offset + len) {
                    return i;
                }
                else if (offset + len <= pos) {
                    min = i + 1;
                }
                else {
                    max = i - 1;
                }
            }
        }
        /**
         * Get indexed byte from chunks
         */
        get(i) {
            if (i < 0 || this.len <= i) {
                throw new Error("out of range");
            }
            const idx = this.getChunkIndex(i);
            const { value, offset, start } = this.chunks[idx];
            return value[start + i - offset];
        }
        /**
         * Iterator of bytes from given position
         */
        *iterator(start = 0) {
            const startIdx = this.getChunkIndex(start);
            if (startIdx < 0)
                return;
            const first = this.chunks[startIdx];
            let firstOffset = start - first.offset;
            for (let i = startIdx; i < this.chunks.length; i++) {
                const chunk = this.chunks[i];
                for (let j = chunk.start + firstOffset; j < chunk.end; j++) {
                    yield chunk.value[j];
                }
                firstOffset = 0;
            }
        }
        /**
         * Returns subset of bytes copied
         */
        slice(start, end = this.len) {
            if (end === start) {
                return new Uint8Array();
            }
            checkRange(start, end, this.len);
            const result = new Uint8Array(end - start);
            const startIdx = this.getChunkIndex(start);
            const endIdx = this.getChunkIndex(end - 1);
            let written = 0;
            for (let i = startIdx; i < endIdx; i++) {
                const chunk = this.chunks[i];
                const len = chunk.end - chunk.start;
                result.set(chunk.value.subarray(chunk.start, chunk.end), written);
                written += len;
            }
            const last = this.chunks[endIdx];
            const rest = end - start - written;
            result.set(last.value.subarray(last.start, last.start + rest), written);
            return result;
        }
        /**
         * Concatenate chunks into single Uint8Array copied.
         */
        concat() {
            const result = new Uint8Array(this.len);
            let sum = 0;
            for (const { value, start, end } of this.chunks) {
                result.set(value.subarray(start, end), sum);
                sum += end - start;
            }
            return result;
        }
    }
    exports.BytesList = BytesList;
    function checkRange(start, end, len) {
        if (start < 0 || len < start || end < 0 || len < end || end < start) {
            throw new Error("invalid range");
        }
    }
});
