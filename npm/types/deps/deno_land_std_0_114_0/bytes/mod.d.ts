/** Returns the index of the first occurrence of the pattern array in the source
 * array, or -1 if it is not present. */
export declare function indexOf(source: Uint8Array, pattern: Uint8Array, fromIndex?: number): number;
/** Find last index of binary pattern from source. If not found, then return -1.
 * @param source source array
 * @param pat pattern to find in source array
 * @param start the index to start looking in the source
 */
export declare function lastIndexOf(source: Uint8Array, pat: Uint8Array, start?: number): number;
/** Check whether binary array starts with prefix.
 * @param source source array
 * @param prefix prefix array to check in source
 */
export declare function startsWith(source: Uint8Array, prefix: Uint8Array): boolean;
/** Check whether binary array ends with suffix.
 * @param source source array
 * @param suffix suffix array to check in source
 */
export declare function endsWith(source: Uint8Array, suffix: Uint8Array): boolean;
/** Repeat bytes. returns a new byte slice consisting of `count` copies of `b`.
 * @param origin The origin bytes
 * @param count The count you want to repeat.
 * @throws `RangeError` When count is negative
 */
export declare function repeat(origin: Uint8Array, count: number): Uint8Array;
/** Concatenate multiple binary arrays and return new one.
 * @param buf binary arrays to concatenate
 */
export declare function concat(...buf: Uint8Array[]): Uint8Array;
/** Determines whether the source array includes the pattern array. */
export declare function includes(source: Uint8Array, pattern: Uint8Array, fromIndex?: number): boolean;
/**
 * Copy bytes from one Uint8Array to another.  Bytes from `src` which don't fit
 * into `dst` will not be copied.
 *
 * @param src Source byte array
 * @param dst Destination byte array
 * @param off Offset into `dst` at which to begin writing values from `src`.
 * @return number of bytes copied
 */
export declare function copy(src: Uint8Array, dst: Uint8Array, off?: number): number;
/** @deprecated */
export { includes as contains };
export { equals } from "./equals.js";
