(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "deno.ns", "./_constants.js", "./_util.js", "../_util/assert.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toFileUrl = exports.fromFileUrl = exports.parse = exports.format = exports.extname = exports.basename = exports.dirname = exports.toNamespacedPath = exports.relative = exports.join = exports.isAbsolute = exports.normalize = exports.resolve = exports.delimiter = exports.sep = void 0;
    const tslib_1 = require("tslib");
    const denoShim = (0, tslib_1.__importStar)(require("deno.ns"));
    const _constants_js_1 = require("./_constants.js");
    const _util_js_1 = require("./_util.js");
    const assert_js_1 = require("../_util/assert.js");
    exports.sep = "\\";
    exports.delimiter = ";";
    /**
     * Resolves path segments into a `path`
     * @param pathSegments to process to path
     */
    function resolve(...pathSegments) {
        let resolvedDevice = "";
        let resolvedTail = "";
        let resolvedAbsolute = false;
        for (let i = pathSegments.length - 1; i >= -1; i--) {
            let path;
            // deno-lint-ignore no-explicit-any
            const { Deno } = ({ ...denoShim, ...globalThis });
            if (i >= 0) {
                path = pathSegments[i];
            }
            else if (!resolvedDevice) {
                if (typeof Deno?.cwd !== "function") {
                    throw new TypeError("Resolved a drive-letter-less path without a CWD.");
                }
                path = Deno.cwd();
            }
            else {
                if (typeof Deno?.env?.get !== "function" || typeof Deno?.cwd !== "function") {
                    throw new TypeError("Resolved a relative path without a CWD.");
                }
                path = Deno.cwd();
                // Verify that a cwd was found and that it actually points
                // to our drive. If not, default to the drive's root.
                if (path === undefined ||
                    path.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                    path = `${resolvedDevice}\\`;
                }
            }
            (0, _util_js_1.assertPath)(path);
            const len = path.length;
            // Skip empty entries
            if (len === 0)
                continue;
            let rootEnd = 0;
            let device = "";
            let isAbsolute = false;
            const code = path.charCodeAt(0);
            // Try to match a root
            if (len > 1) {
                if ((0, _util_js_1.isPathSeparator)(code)) {
                    // Possible UNC root
                    // If we started with a separator, we know we at least have an
                    // absolute path of some kind (UNC or otherwise)
                    isAbsolute = true;
                    if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(1))) {
                        // Matched double path separator at beginning
                        let j = 2;
                        let last = j;
                        // Match 1 or more non-path separators
                        for (; j < len; ++j) {
                            if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            const firstPart = path.slice(last, j);
                            // Matched!
                            last = j;
                            // Match 1 or more path separators
                            for (; j < len; ++j) {
                                if (!(0, _util_js_1.isPathSeparator)(path.charCodeAt(j)))
                                    break;
                            }
                            if (j < len && j !== last) {
                                // Matched!
                                last = j;
                                // Match 1 or more non-path separators
                                for (; j < len; ++j) {
                                    if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(j)))
                                        break;
                                }
                                if (j === len) {
                                    // We matched a UNC root only
                                    device = `\\\\${firstPart}\\${path.slice(last)}`;
                                    rootEnd = j;
                                }
                                else if (j !== last) {
                                    // We matched a UNC root with leftovers
                                    device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                                    rootEnd = j;
                                }
                            }
                        }
                    }
                    else {
                        rootEnd = 1;
                    }
                }
                else if ((0, _util_js_1.isWindowsDeviceRoot)(code)) {
                    // Possible device root
                    if (path.charCodeAt(1) === _constants_js_1.CHAR_COLON) {
                        device = path.slice(0, 2);
                        rootEnd = 2;
                        if (len > 2) {
                            if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(2))) {
                                // Treat separator following drive name as an absolute path
                                // indicator
                                isAbsolute = true;
                                rootEnd = 3;
                            }
                        }
                    }
                }
            }
            else if ((0, _util_js_1.isPathSeparator)(code)) {
                // `path` contains just a path separator
                rootEnd = 1;
                isAbsolute = true;
            }
            if (device.length > 0 &&
                resolvedDevice.length > 0 &&
                device.toLowerCase() !== resolvedDevice.toLowerCase()) {
                // This path points to another device so it is not applicable
                continue;
            }
            if (resolvedDevice.length === 0 && device.length > 0) {
                resolvedDevice = device;
            }
            if (!resolvedAbsolute) {
                resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
                resolvedAbsolute = isAbsolute;
            }
            if (resolvedAbsolute && resolvedDevice.length > 0)
                break;
        }
        // At this point the path should be resolved to a full absolute path,
        // but handle relative paths to be safe (might happen when process.cwd()
        // fails)
        // Normalize the tail path
        resolvedTail = (0, _util_js_1.normalizeString)(resolvedTail, !resolvedAbsolute, "\\", _util_js_1.isPathSeparator);
        return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
    }
    exports.resolve = resolve;
    /**
     * Normalizes a `path`
     * @param path to normalize
     */
    function normalize(path) {
        (0, _util_js_1.assertPath)(path);
        const len = path.length;
        if (len === 0)
            return ".";
        let rootEnd = 0;
        let device;
        let isAbsolute = false;
        const code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
            if ((0, _util_js_1.isPathSeparator)(code)) {
                // Possible UNC root
                // If we started with a separator, we know we at least have an absolute
                // path of some kind (UNC or otherwise)
                isAbsolute = true;
                if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(1))) {
                    // Matched double path separator at beginning
                    let j = 2;
                    let last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                        if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        const firstPart = path.slice(last, j);
                        // Matched!
                        last = j;
                        // Match 1 or more path separators
                        for (; j < len; ++j) {
                            if (!(0, _util_js_1.isPathSeparator)(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            // Matched!
                            last = j;
                            // Match 1 or more non-path separators
                            for (; j < len; ++j) {
                                if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                // We matched a UNC root only
                                // Return the normalized version of the UNC root since there
                                // is nothing left to process
                                return `\\\\${firstPart}\\${path.slice(last)}\\`;
                            }
                            else if (j !== last) {
                                // We matched a UNC root with leftovers
                                device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                                rootEnd = j;
                            }
                        }
                    }
                }
                else {
                    rootEnd = 1;
                }
            }
            else if ((0, _util_js_1.isWindowsDeviceRoot)(code)) {
                // Possible device root
                if (path.charCodeAt(1) === _constants_js_1.CHAR_COLON) {
                    device = path.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(2))) {
                            // Treat separator following drive name as an absolute path
                            // indicator
                            isAbsolute = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        }
        else if ((0, _util_js_1.isPathSeparator)(code)) {
            // `path` contains just a path separator, exit early to avoid unnecessary
            // work
            return "\\";
        }
        let tail;
        if (rootEnd < len) {
            tail = (0, _util_js_1.normalizeString)(path.slice(rootEnd), !isAbsolute, "\\", _util_js_1.isPathSeparator);
        }
        else {
            tail = "";
        }
        if (tail.length === 0 && !isAbsolute)
            tail = ".";
        if (tail.length > 0 && (0, _util_js_1.isPathSeparator)(path.charCodeAt(len - 1))) {
            tail += "\\";
        }
        if (device === undefined) {
            if (isAbsolute) {
                if (tail.length > 0)
                    return `\\${tail}`;
                else
                    return "\\";
            }
            else if (tail.length > 0) {
                return tail;
            }
            else {
                return "";
            }
        }
        else if (isAbsolute) {
            if (tail.length > 0)
                return `${device}\\${tail}`;
            else
                return `${device}\\`;
        }
        else if (tail.length > 0) {
            return device + tail;
        }
        else {
            return device;
        }
    }
    exports.normalize = normalize;
    /**
     * Verifies whether path is absolute
     * @param path to verify
     */
    function isAbsolute(path) {
        (0, _util_js_1.assertPath)(path);
        const len = path.length;
        if (len === 0)
            return false;
        const code = path.charCodeAt(0);
        if ((0, _util_js_1.isPathSeparator)(code)) {
            return true;
        }
        else if ((0, _util_js_1.isWindowsDeviceRoot)(code)) {
            // Possible device root
            if (len > 2 && path.charCodeAt(1) === _constants_js_1.CHAR_COLON) {
                if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(2)))
                    return true;
            }
        }
        return false;
    }
    exports.isAbsolute = isAbsolute;
    /**
     * Join all given a sequence of `paths`,then normalizes the resulting path.
     * @param paths to be joined and normalized
     */
    function join(...paths) {
        const pathsCount = paths.length;
        if (pathsCount === 0)
            return ".";
        let joined;
        let firstPart = null;
        for (let i = 0; i < pathsCount; ++i) {
            const path = paths[i];
            (0, _util_js_1.assertPath)(path);
            if (path.length > 0) {
                if (joined === undefined)
                    joined = firstPart = path;
                else
                    joined += `\\${path}`;
            }
        }
        if (joined === undefined)
            return ".";
        // Make sure that the joined path doesn't start with two slashes, because
        // normalize() will mistake it for an UNC path then.
        //
        // This step is skipped when it is very clear that the user actually
        // intended to point at an UNC path. This is assumed when the first
        // non-empty string arguments starts with exactly two slashes followed by
        // at least one more non-slash character.
        //
        // Note that for normalize() to treat a path as an UNC path it needs to
        // have at least 2 components, so we don't filter for that here.
        // This means that the user can use join to construct UNC paths from
        // a server name and a share name; for example:
        //   path.join('//server', 'share') -> '\\\\server\\share\\')
        let needsReplace = true;
        let slashCount = 0;
        (0, assert_js_1.assert)(firstPart != null);
        if ((0, _util_js_1.isPathSeparator)(firstPart.charCodeAt(0))) {
            ++slashCount;
            const firstLen = firstPart.length;
            if (firstLen > 1) {
                if ((0, _util_js_1.isPathSeparator)(firstPart.charCodeAt(1))) {
                    ++slashCount;
                    if (firstLen > 2) {
                        if ((0, _util_js_1.isPathSeparator)(firstPart.charCodeAt(2)))
                            ++slashCount;
                        else {
                            // We matched a UNC path in the first part
                            needsReplace = false;
                        }
                    }
                }
            }
        }
        if (needsReplace) {
            // Find any more consecutive slashes we need to replace
            for (; slashCount < joined.length; ++slashCount) {
                if (!(0, _util_js_1.isPathSeparator)(joined.charCodeAt(slashCount)))
                    break;
            }
            // Replace the slashes if needed
            if (slashCount >= 2)
                joined = `\\${joined.slice(slashCount)}`;
        }
        return normalize(joined);
    }
    exports.join = join;
    /**
     * It will solve the relative path from `from` to `to`, for instance:
     *  from = 'C:\\orandea\\test\\aaa'
     *  to = 'C:\\orandea\\impl\\bbb'
     * The output of the function should be: '..\\..\\impl\\bbb'
     * @param from relative path
     * @param to relative path
     */
    function relative(from, to) {
        (0, _util_js_1.assertPath)(from);
        (0, _util_js_1.assertPath)(to);
        if (from === to)
            return "";
        const fromOrig = resolve(from);
        const toOrig = resolve(to);
        if (fromOrig === toOrig)
            return "";
        from = fromOrig.toLowerCase();
        to = toOrig.toLowerCase();
        if (from === to)
            return "";
        // Trim any leading backslashes
        let fromStart = 0;
        let fromEnd = from.length;
        for (; fromStart < fromEnd; ++fromStart) {
            if (from.charCodeAt(fromStart) !== _constants_js_1.CHAR_BACKWARD_SLASH)
                break;
        }
        // Trim trailing backslashes (applicable to UNC paths only)
        for (; fromEnd - 1 > fromStart; --fromEnd) {
            if (from.charCodeAt(fromEnd - 1) !== _constants_js_1.CHAR_BACKWARD_SLASH)
                break;
        }
        const fromLen = fromEnd - fromStart;
        // Trim any leading backslashes
        let toStart = 0;
        let toEnd = to.length;
        for (; toStart < toEnd; ++toStart) {
            if (to.charCodeAt(toStart) !== _constants_js_1.CHAR_BACKWARD_SLASH)
                break;
        }
        // Trim trailing backslashes (applicable to UNC paths only)
        for (; toEnd - 1 > toStart; --toEnd) {
            if (to.charCodeAt(toEnd - 1) !== _constants_js_1.CHAR_BACKWARD_SLASH)
                break;
        }
        const toLen = toEnd - toStart;
        // Compare paths to find the longest common path from root
        const length = fromLen < toLen ? fromLen : toLen;
        let lastCommonSep = -1;
        let i = 0;
        for (; i <= length; ++i) {
            if (i === length) {
                if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === _constants_js_1.CHAR_BACKWARD_SLASH) {
                        // We get here if `from` is the exact base path for `to`.
                        // For example: from='C:\\foo\\bar'; to='C:\\foo\\bar\\baz'
                        return toOrig.slice(toStart + i + 1);
                    }
                    else if (i === 2) {
                        // We get here if `from` is the device root.
                        // For example: from='C:\\'; to='C:\\foo'
                        return toOrig.slice(toStart + i);
                    }
                }
                if (fromLen > length) {
                    if (from.charCodeAt(fromStart + i) === _constants_js_1.CHAR_BACKWARD_SLASH) {
                        // We get here if `to` is the exact base path for `from`.
                        // For example: from='C:\\foo\\bar'; to='C:\\foo'
                        lastCommonSep = i;
                    }
                    else if (i === 2) {
                        // We get here if `to` is the device root.
                        // For example: from='C:\\foo\\bar'; to='C:\\'
                        lastCommonSep = 3;
                    }
                }
                break;
            }
            const fromCode = from.charCodeAt(fromStart + i);
            const toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
                break;
            else if (fromCode === _constants_js_1.CHAR_BACKWARD_SLASH)
                lastCommonSep = i;
        }
        // We found a mismatch before the first common path separator was seen, so
        // return the original `to`.
        if (i !== length && lastCommonSep === -1) {
            return toOrig;
        }
        let out = "";
        if (lastCommonSep === -1)
            lastCommonSep = 0;
        // Generate the relative path based on the path difference between `to` and
        // `from`
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === _constants_js_1.CHAR_BACKWARD_SLASH) {
                if (out.length === 0)
                    out += "..";
                else
                    out += "\\..";
            }
        }
        // Lastly, append the rest of the destination (`to`) path that comes after
        // the common path parts
        if (out.length > 0) {
            return out + toOrig.slice(toStart + lastCommonSep, toEnd);
        }
        else {
            toStart += lastCommonSep;
            if (toOrig.charCodeAt(toStart) === _constants_js_1.CHAR_BACKWARD_SLASH)
                ++toStart;
            return toOrig.slice(toStart, toEnd);
        }
    }
    exports.relative = relative;
    /**
     * Resolves path to a namespace path
     * @param path to resolve to namespace
     */
    function toNamespacedPath(path) {
        // Note: this will *probably* throw somewhere.
        if (typeof path !== "string")
            return path;
        if (path.length === 0)
            return "";
        const resolvedPath = resolve(path);
        if (resolvedPath.length >= 3) {
            if (resolvedPath.charCodeAt(0) === _constants_js_1.CHAR_BACKWARD_SLASH) {
                // Possible UNC root
                if (resolvedPath.charCodeAt(1) === _constants_js_1.CHAR_BACKWARD_SLASH) {
                    const code = resolvedPath.charCodeAt(2);
                    if (code !== _constants_js_1.CHAR_QUESTION_MARK && code !== _constants_js_1.CHAR_DOT) {
                        // Matched non-long UNC root, convert the path to a long UNC path
                        return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
                    }
                }
            }
            else if ((0, _util_js_1.isWindowsDeviceRoot)(resolvedPath.charCodeAt(0))) {
                // Possible device root
                if (resolvedPath.charCodeAt(1) === _constants_js_1.CHAR_COLON &&
                    resolvedPath.charCodeAt(2) === _constants_js_1.CHAR_BACKWARD_SLASH) {
                    // Matched device root, convert the path to a long UNC path
                    return `\\\\?\\${resolvedPath}`;
                }
            }
        }
        return path;
    }
    exports.toNamespacedPath = toNamespacedPath;
    /**
     * Return the directory name of a `path`.
     * @param path to determine name for
     */
    function dirname(path) {
        (0, _util_js_1.assertPath)(path);
        const len = path.length;
        if (len === 0)
            return ".";
        let rootEnd = -1;
        let end = -1;
        let matchedSlash = true;
        let offset = 0;
        const code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
            if ((0, _util_js_1.isPathSeparator)(code)) {
                // Possible UNC root
                rootEnd = offset = 1;
                if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(1))) {
                    // Matched double path separator at beginning
                    let j = 2;
                    let last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                        if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        // Matched!
                        last = j;
                        // Match 1 or more path separators
                        for (; j < len; ++j) {
                            if (!(0, _util_js_1.isPathSeparator)(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            // Matched!
                            last = j;
                            // Match 1 or more non-path separators
                            for (; j < len; ++j) {
                                if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                // We matched a UNC root only
                                return path;
                            }
                            if (j !== last) {
                                // We matched a UNC root with leftovers
                                // Offset by 1 to include the separator after the UNC root to
                                // treat it as a "normal root" on top of a (UNC) root
                                rootEnd = offset = j + 1;
                            }
                        }
                    }
                }
            }
            else if ((0, _util_js_1.isWindowsDeviceRoot)(code)) {
                // Possible device root
                if (path.charCodeAt(1) === _constants_js_1.CHAR_COLON) {
                    rootEnd = offset = 2;
                    if (len > 2) {
                        if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(2)))
                            rootEnd = offset = 3;
                    }
                }
            }
        }
        else if ((0, _util_js_1.isPathSeparator)(code)) {
            // `path` contains just a path separator, exit early to avoid
            // unnecessary work
            return path;
        }
        for (let i = len - 1; i >= offset; --i) {
            if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(i))) {
                if (!matchedSlash) {
                    end = i;
                    break;
                }
            }
            else {
                // We saw the first non-path separator
                matchedSlash = false;
            }
        }
        if (end === -1) {
            if (rootEnd === -1)
                return ".";
            else
                end = rootEnd;
        }
        return path.slice(0, end);
    }
    exports.dirname = dirname;
    /**
     * Return the last portion of a `path`. Trailing directory separators are ignored.
     * @param path to process
     * @param ext of path directory
     */
    function basename(path, ext = "") {
        if (ext !== undefined && typeof ext !== "string") {
            throw new TypeError('"ext" argument must be a string');
        }
        (0, _util_js_1.assertPath)(path);
        let start = 0;
        let end = -1;
        let matchedSlash = true;
        let i;
        // Check for a drive letter prefix so as not to mistake the following
        // path separator as an extra separator at the end of the path that can be
        // disregarded
        if (path.length >= 2) {
            const drive = path.charCodeAt(0);
            if ((0, _util_js_1.isWindowsDeviceRoot)(drive)) {
                if (path.charCodeAt(1) === _constants_js_1.CHAR_COLON)
                    start = 2;
            }
        }
        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path)
                return "";
            let extIdx = ext.length - 1;
            let firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= start; --i) {
                const code = path.charCodeAt(i);
                if ((0, _util_js_1.isPathSeparator)(code)) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else {
                    if (firstNonSlashEnd === -1) {
                        // We saw the first non-path separator, remember this index in case
                        // we need it if the extension ends up not matching
                        matchedSlash = false;
                        firstNonSlashEnd = i + 1;
                    }
                    if (extIdx >= 0) {
                        // Try to match the explicit extension
                        if (code === ext.charCodeAt(extIdx)) {
                            if (--extIdx === -1) {
                                // We matched the extension, so mark this as the end of our path
                                // component
                                end = i;
                            }
                        }
                        else {
                            // Extension does not match, so our result is the entire path
                            // component
                            extIdx = -1;
                            end = firstNonSlashEnd;
                        }
                    }
                }
            }
            if (start === end)
                end = firstNonSlashEnd;
            else if (end === -1)
                end = path.length;
            return path.slice(start, end);
        }
        else {
            for (i = path.length - 1; i >= start; --i) {
                if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(i))) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else if (end === -1) {
                    // We saw the first non-path separator, mark this as the end of our
                    // path component
                    matchedSlash = false;
                    end = i + 1;
                }
            }
            if (end === -1)
                return "";
            return path.slice(start, end);
        }
    }
    exports.basename = basename;
    /**
     * Return the extension of the `path`.
     * @param path with extension
     */
    function extname(path) {
        (0, _util_js_1.assertPath)(path);
        let start = 0;
        let startDot = -1;
        let startPart = 0;
        let end = -1;
        let matchedSlash = true;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        let preDotState = 0;
        // Check for a drive letter prefix so as not to mistake the following
        // path separator as an extra separator at the end of the path that can be
        // disregarded
        if (path.length >= 2 &&
            path.charCodeAt(1) === _constants_js_1.CHAR_COLON &&
            (0, _util_js_1.isWindowsDeviceRoot)(path.charCodeAt(0))) {
            start = startPart = 2;
        }
        for (let i = path.length - 1; i >= start; --i) {
            const code = path.charCodeAt(i);
            if ((0, _util_js_1.isPathSeparator)(code)) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === _constants_js_1.CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            return "";
        }
        return path.slice(startDot, end);
    }
    exports.extname = extname;
    /**
     * Generate a path from `FormatInputPathObject` object.
     * @param pathObject with path
     */
    function format(pathObject) {
        if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
        }
        return (0, _util_js_1._format)("\\", pathObject);
    }
    exports.format = format;
    /**
     * Return a `ParsedPath` object of the `path`.
     * @param path to process
     */
    function parse(path) {
        (0, _util_js_1.assertPath)(path);
        const ret = { root: "", dir: "", base: "", ext: "", name: "" };
        const len = path.length;
        if (len === 0)
            return ret;
        let rootEnd = 0;
        let code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
            if ((0, _util_js_1.isPathSeparator)(code)) {
                // Possible UNC root
                rootEnd = 1;
                if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(1))) {
                    // Matched double path separator at beginning
                    let j = 2;
                    let last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                        if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        // Matched!
                        last = j;
                        // Match 1 or more path separators
                        for (; j < len; ++j) {
                            if (!(0, _util_js_1.isPathSeparator)(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            // Matched!
                            last = j;
                            // Match 1 or more non-path separators
                            for (; j < len; ++j) {
                                if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                // We matched a UNC root only
                                rootEnd = j;
                            }
                            else if (j !== last) {
                                // We matched a UNC root with leftovers
                                rootEnd = j + 1;
                            }
                        }
                    }
                }
            }
            else if ((0, _util_js_1.isWindowsDeviceRoot)(code)) {
                // Possible device root
                if (path.charCodeAt(1) === _constants_js_1.CHAR_COLON) {
                    rootEnd = 2;
                    if (len > 2) {
                        if ((0, _util_js_1.isPathSeparator)(path.charCodeAt(2))) {
                            if (len === 3) {
                                // `path` contains just a drive root, exit early to avoid
                                // unnecessary work
                                ret.root = ret.dir = path;
                                return ret;
                            }
                            rootEnd = 3;
                        }
                    }
                    else {
                        // `path` contains just a drive root, exit early to avoid
                        // unnecessary work
                        ret.root = ret.dir = path;
                        return ret;
                    }
                }
            }
        }
        else if ((0, _util_js_1.isPathSeparator)(code)) {
            // `path` contains just a path separator, exit early to avoid
            // unnecessary work
            ret.root = ret.dir = path;
            return ret;
        }
        if (rootEnd > 0)
            ret.root = path.slice(0, rootEnd);
        let startDot = -1;
        let startPart = rootEnd;
        let end = -1;
        let matchedSlash = true;
        let i = path.length - 1;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        let preDotState = 0;
        // Get non-dir info
        for (; i >= rootEnd; --i) {
            code = path.charCodeAt(i);
            if ((0, _util_js_1.isPathSeparator)(code)) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === _constants_js_1.CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            if (end !== -1) {
                ret.base = ret.name = path.slice(startPart, end);
            }
        }
        else {
            ret.name = path.slice(startPart, startDot);
            ret.base = path.slice(startPart, end);
            ret.ext = path.slice(startDot, end);
        }
        // If the directory is the root, use the entire root as the `dir` including
        // the trailing slash if any (`C:\abc` -> `C:\`). Otherwise, strip out the
        // trailing slash (`C:\abc\def` -> `C:\abc`).
        if (startPart > 0 && startPart !== rootEnd) {
            ret.dir = path.slice(0, startPart - 1);
        }
        else
            ret.dir = ret.root;
        return ret;
    }
    exports.parse = parse;
    /**
     * Converts a file URL to a path string.
     *
     * ```ts
     *      import { fromFileUrl } from "./win32.ts";
     *      fromFileUrl("file:///home/foo"); // "\\home\\foo"
     *      fromFileUrl("file:///C:/Users/foo"); // "C:\\Users\\foo"
     *      fromFileUrl("file://localhost/home/foo"); // "\\\\localhost\\home\\foo"
     * ```
     * @param url of a file URL
     */
    function fromFileUrl(url) {
        url = url instanceof URL ? url : new URL(url);
        if (url.protocol != "file:") {
            throw new TypeError("Must be a file URL.");
        }
        let path = decodeURIComponent(url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
        if (url.hostname != "") {
            // Note: The `URL` implementation guarantees that the drive letter and
            // hostname are mutually exclusive. Otherwise it would not have been valid
            // to append the hostname and path like this.
            path = `\\\\${url.hostname}${path}`;
        }
        return path;
    }
    exports.fromFileUrl = fromFileUrl;
    /**
     * Converts a path string to a file URL.
     *
     * ```ts
     *      import { toFileUrl } from "./win32.ts";
     *      toFileUrl("\\home\\foo"); // new URL("file:///home/foo")
     *      toFileUrl("C:\\Users\\foo"); // new URL("file:///C:/Users/foo")
     *      toFileUrl("\\\\127.0.0.1\\home\\foo"); // new URL("file://127.0.0.1/home/foo")
     * ```
     * @param path to convert to file URL
     */
    function toFileUrl(path) {
        if (!isAbsolute(path)) {
            throw new TypeError("Must be an absolute path.");
        }
        const [, hostname, pathname] = path.match(/^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/);
        const url = new URL("file:///");
        url.pathname = (0, _util_js_1.encodeWhitespace)(pathname.replace(/%/g, "%25"));
        if (hostname != null && hostname != "localhost") {
            url.hostname = hostname;
            if (!url.hostname) {
                throw new TypeError("Invalid hostname.");
            }
        }
        return url;
    }
    exports.toFileUrl = toFileUrl;
});
