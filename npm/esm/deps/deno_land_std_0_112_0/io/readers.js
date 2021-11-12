// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
// Based on https://github.com/golang/go/blob/0452f9460f50f0f0aba18df43dc2b31906fb66cc/src/io/io.go
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
import { Buffer } from "./buffer.js";
/** Reader utility for strings */
export class StringReader extends Buffer {
    constructor(s) {
        super(new TextEncoder().encode(s).buffer);
    }
}
/** Reader utility for combining multiple readers */
export class MultiReader {
    constructor(...readers) {
        Object.defineProperty(this, "readers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "currentIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this.readers = readers;
    }
    async read(p) {
        const r = this.readers[this.currentIndex];
        if (!r)
            return null;
        const result = await r.read(p);
        if (result === null) {
            this.currentIndex++;
            return 0;
        }
        return result;
    }
}
/**
 * A `LimitedReader` reads from `reader` but limits the amount of data returned to just `limit` bytes.
 * Each call to `read` updates `limit` to reflect the new amount remaining.
 * `read` returns `null` when `limit` <= `0` or
 * when the underlying `reader` returns `null`.
 */
export class LimitedReader {
    constructor(reader, limit) {
        Object.defineProperty(this, "reader", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: reader
        });
        Object.defineProperty(this, "limit", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: limit
        });
    }
    async read(p) {
        if (this.limit <= 0) {
            return null;
        }
        if (p.length > this.limit) {
            p = p.subarray(0, this.limit);
        }
        const n = await this.reader.read(p);
        if (n == null) {
            return null;
        }
        this.limit -= n;
        return n;
    }
}
