import * as denoShim from "deno.ns";
export interface ByteRange {
    /** The 0 based index of the start byte for a range. */
    start: number;
    /** The 0 based index of the end byte for a range, which is inclusive. */
    end: number;
}
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
export declare function readRange(r: denoShim.Deno.Reader & denoShim.Deno.Seeker, range: ByteRange): Promise<Uint8Array>;
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
export declare function readRangeSync(r: denoShim.Deno.ReaderSync & denoShim.Deno.SeekerSync, range: ByteRange): Uint8Array;
