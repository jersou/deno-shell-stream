import type { BufReader } from "./buffer.js";
import type { Reader, Writer } from "./types.d.js";
import * as streams from "../streams/conversion.js";
import * as files from "./files.js";
/**
 * Copy N size at the most. If read size is lesser than N, then returns nread
 * @param r Reader
 * @param dest Writer
 * @param size Read size
 */
export declare function copyN(r: Reader, dest: Writer, size: number): Promise<number>;
/**
 * Read big endian 16bit short from BufReader
 * @param buf
 */
export declare function readShort(buf: BufReader): Promise<number | null>;
/**
 * Read big endian 32bit integer from BufReader
 * @param buf
 */
export declare function readInt(buf: BufReader): Promise<number | null>;
/**
 * Read big endian 64bit long from BufReader
 * @param buf
 */
export declare function readLong(buf: BufReader): Promise<number | null>;
/**
 * Slice number into 64bit big endian byte array
 * @param d The number to be sliced
 * @param dest The sliced array
 */
export declare function sliceLongToBytes(d: number, dest?: any[]): number[];
/** @deprecated Use readAll from https://deno.land/std/streams/conversion.ts instead. */
export declare const readAll: typeof streams.readAll;
/** @deprecated Use readAllSync from https://deno.land/std/streams/conversion.ts instead. */
export declare const readAllSync: typeof streams.readAllSync;
/** @deprecated Use writeAll from https://deno.land/std/streams/conversion.ts instead. */
export declare const writeAll: typeof streams.writeAll;
/** @deprecated Use writeAllSync from https://deno.land/std/streams/conversion.ts instead. */
export declare const writeAllSync: typeof streams.writeAllSync;
/** @deprecated Use iterateReader from https://deno.land/std/streams/conversion.ts instead. */
export declare const iter: typeof streams.iterateReader;
/** @deprecated Use iterateReaderSync from https://deno.land/std/streams/conversion.ts instead. */
export declare const iterSync: typeof streams.iterateReaderSync;
/** @deprecated Use copy from https://deno.land/std/streams/conversion.ts instead. */
export declare const copy: typeof streams.copy;
/** @deprecated Use readRange from https://deno.land/std/io/files.ts instead. */
export declare const readRange: typeof files.readRange;
/** @deprecated Use readRangeSync from https://deno.land/std/io/files.ts instead. */
export declare const readRangeSync: typeof files.readRangeSync;
