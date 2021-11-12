import * as denoShim from "deno.ns";
import { Buffer } from "./buffer.js";
/** Reader utility for strings */
export declare class StringReader extends Buffer {
    constructor(s: string);
}
/** Reader utility for combining multiple readers */
export declare class MultiReader implements denoShim.Deno.Reader {
    private readonly readers;
    private currentIndex;
    constructor(...readers: denoShim.Deno.Reader[]);
    read(p: Uint8Array): Promise<number | null>;
}
/**
 * A `LimitedReader` reads from `reader` but limits the amount of data returned to just `limit` bytes.
 * Each call to `read` updates `limit` to reflect the new amount remaining.
 * `read` returns `null` when `limit` <= `0` or
 * when the underlying `reader` returns `null`.
 */
export declare class LimitedReader implements denoShim.Deno.Reader {
    reader: denoShim.Deno.Reader;
    limit: number;
    constructor(reader: denoShim.Deno.Reader, limit: number);
    read(p: Uint8Array): Promise<number | null>;
}
