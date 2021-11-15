var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "deno.ns", "../_util/assert.js", "../path/mod.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.walkSync = exports.walk = exports._createWalkEntry = exports._createWalkEntrySync = void 0;
    const denoShim = __importStar(require("deno.ns"));
    // Documentation and interface for walk were adapted from Go
    // https://golang.org/pkg/path/filepath/#Walk
    // Copyright 2009 The Go Authors. All rights reserved. BSD license.
    const assert_js_1 = require("../_util/assert.js");
    const mod_js_1 = require("../path/mod.js");
    /** Create WalkEntry for the `path` synchronously */
    function _createWalkEntrySync(path) {
        path = (0, mod_js_1.normalize)(path);
        const name = (0, mod_js_1.basename)(path);
        const info = denoShim.Deno.statSync(path);
        return {
            path,
            name,
            isFile: info.isFile,
            isDirectory: info.isDirectory,
            isSymlink: info.isSymlink,
        };
    }
    exports._createWalkEntrySync = _createWalkEntrySync;
    /** Create WalkEntry for the `path` asynchronously */
    async function _createWalkEntry(path) {
        path = (0, mod_js_1.normalize)(path);
        const name = (0, mod_js_1.basename)(path);
        const info = await denoShim.Deno.stat(path);
        return {
            path,
            name,
            isFile: info.isFile,
            isDirectory: info.isDirectory,
            isSymlink: info.isSymlink,
        };
    }
    exports._createWalkEntry = _createWalkEntry;
    function include(path, exts, match, skip) {
        if (exts && !exts.some((ext) => path.endsWith(ext))) {
            return false;
        }
        if (match && !match.some((pattern) => !!path.match(pattern))) {
            return false;
        }
        if (skip && skip.some((pattern) => !!path.match(pattern))) {
            return false;
        }
        return true;
    }
    function wrapErrorWithRootPath(err, root) {
        if (err instanceof Error && "root" in err)
            return err;
        const e = new Error();
        e.root = root;
        e.message = err instanceof Error
            ? `${err.message} for path "${root}"`
            : `[non-error thrown] for path "${root}"`;
        e.stack = err instanceof Error ? err.stack : undefined;
        e.cause = err instanceof Error ? err.cause : undefined;
        return e;
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
    async function* walk(root, { maxDepth = Infinity, includeFiles = true, includeDirs = true, followSymlinks = false, exts = undefined, match = undefined, skip = undefined, } = {}) {
        if (maxDepth < 0) {
            return;
        }
        if (includeDirs && include(root, exts, match, skip)) {
            yield await _createWalkEntry(root);
        }
        if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
            return;
        }
        try {
            for await (const entry of denoShim.Deno.readDir(root)) {
                (0, assert_js_1.assert)(entry.name != null);
                let path = (0, mod_js_1.join)(root, entry.name);
                if (entry.isSymlink) {
                    if (followSymlinks) {
                        path = await denoShim.Deno.realPath(path);
                    }
                    else {
                        continue;
                    }
                }
                if (entry.isFile) {
                    if (includeFiles && include(path, exts, match, skip)) {
                        yield { path, ...entry };
                    }
                }
                else {
                    yield* walk(path, {
                        maxDepth: maxDepth - 1,
                        includeFiles,
                        includeDirs,
                        followSymlinks,
                        exts,
                        match,
                        skip,
                    });
                }
            }
        }
        catch (err) {
            throw wrapErrorWithRootPath(err, (0, mod_js_1.normalize)(root));
        }
    }
    exports.walk = walk;
    /** Same as walk() but uses synchronous ops */
    function* walkSync(root, { maxDepth = Infinity, includeFiles = true, includeDirs = true, followSymlinks = false, exts = undefined, match = undefined, skip = undefined, } = {}) {
        if (maxDepth < 0) {
            return;
        }
        if (includeDirs && include(root, exts, match, skip)) {
            yield _createWalkEntrySync(root);
        }
        if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
            return;
        }
        let entries;
        try {
            entries = denoShim.Deno.readDirSync(root);
        }
        catch (err) {
            throw wrapErrorWithRootPath(err, (0, mod_js_1.normalize)(root));
        }
        for (const entry of entries) {
            (0, assert_js_1.assert)(entry.name != null);
            let path = (0, mod_js_1.join)(root, entry.name);
            if (entry.isSymlink) {
                if (followSymlinks) {
                    path = denoShim.Deno.realPathSync(path);
                }
                else {
                    continue;
                }
            }
            if (entry.isFile) {
                if (includeFiles && include(path, exts, match, skip)) {
                    yield { path, ...entry };
                }
            }
            else {
                yield* walkSync(path, {
                    maxDepth: maxDepth - 1,
                    includeFiles,
                    includeDirs,
                    followSymlinks,
                    exts,
                    match,
                    skip,
                });
            }
        }
    }
    exports.walkSync = walkSync;
});
