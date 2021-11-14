import * as denoShim from "deno.ns";
/** Create WalkEntry for the `path` synchronously */
export declare function _createWalkEntrySync(path: string): WalkEntry;
/** Create WalkEntry for the `path` asynchronously */
export declare function _createWalkEntry(path: string): Promise<WalkEntry>;
export interface WalkOptions {
    maxDepth?: number;
    includeFiles?: boolean;
    includeDirs?: boolean;
    followSymlinks?: boolean;
    exts?: string[];
    match?: RegExp[];
    skip?: RegExp[];
}
export interface WalkEntry extends denoShim.Deno.DirEntry {
    path: string;
}
/** Walks the file tree rooted at root, yielding each file or directory in the
 * tree filtered according to the given options. The files are walked in lexical
 * order, which makes the output deterministic but means that for very large
 * directories walk() can be inefficient.
 *
 * Options:
 * - maxDepth?: number = Infinity;
 * - includeFiles?: boolean = true;
 * - includeDirs?: boolean = true;
 * - followSymlinks?: boolean = false;
 * - exts?: string[];
 * - match?: RegExp[];
 * - skip?: RegExp[];
 *
 * ```ts
 *       import { walk } from "./walk.ts";
 *       import { assert } from "../testing/asserts.ts";
 *
 *       for await (const entry of walk(".")) {
 *         console.log(entry.path);
 *         assert(entry.isFile);
 *       }
 * ```
 */
export declare function walk(root: string, { maxDepth, includeFiles, includeDirs, followSymlinks, exts, match, skip, }?: WalkOptions): AsyncIterableIterator<WalkEntry>;
/** Same as walk() but uses synchronous ops */
export declare function walkSync(root: string, { maxDepth, includeFiles, includeDirs, followSymlinks, exts, match, skip, }?: WalkOptions): IterableIterator<WalkEntry>;
