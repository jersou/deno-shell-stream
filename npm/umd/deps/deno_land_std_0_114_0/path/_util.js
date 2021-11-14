// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
// This module is browser compatible.
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./_constants.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeWhitespace = exports._format = exports.normalizeString = exports.isWindowsDeviceRoot = exports.isPathSeparator = exports.isPosixPathSeparator = exports.assertPath = void 0;
    const _constants_js_1 = require("./_constants.js");
    function assertPath(path) {
        if (typeof path !== "string") {
            throw new TypeError(`Path must be a string. Received ${JSON.stringify(path)}`);
        }
    }
    exports.assertPath = assertPath;
    function isPosixPathSeparator(code) {
        return code === _constants_js_1.CHAR_FORWARD_SLASH;
    }
    exports.isPosixPathSeparator = isPosixPathSeparator;
    function isPathSeparator(code) {
        return isPosixPathSeparator(code) || code === _constants_js_1.CHAR_BACKWARD_SLASH;
    }
    exports.isPathSeparator = isPathSeparator;
    function isWindowsDeviceRoot(code) {
        return ((code >= _constants_js_1.CHAR_LOWERCASE_A && code <= _constants_js_1.CHAR_LOWERCASE_Z) ||
            (code >= _constants_js_1.CHAR_UPPERCASE_A && code <= _constants_js_1.CHAR_UPPERCASE_Z));
    }
    exports.isWindowsDeviceRoot = isWindowsDeviceRoot;
    // Resolves . and .. elements in a path with directory names
    function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
        let res = "";
        let lastSegmentLength = 0;
        let lastSlash = -1;
        let dots = 0;
        let code;
        for (let i = 0, len = path.length; i <= len; ++i) {
            if (i < len)
                code = path.charCodeAt(i);
            else if (isPathSeparator(code))
                break;
            else
                code = _constants_js_1.CHAR_FORWARD_SLASH;
            if (isPathSeparator(code)) {
                if (lastSlash === i - 1 || dots === 1) {
                    // NOOP
                }
                else if (lastSlash !== i - 1 && dots === 2) {
                    if (res.length < 2 ||
                        lastSegmentLength !== 2 ||
                        res.charCodeAt(res.length - 1) !== _constants_js_1.CHAR_DOT ||
                        res.charCodeAt(res.length - 2) !== _constants_js_1.CHAR_DOT) {
                        if (res.length > 2) {
                            const lastSlashIndex = res.lastIndexOf(separator);
                            if (lastSlashIndex === -1) {
                                res = "";
                                lastSegmentLength = 0;
                            }
                            else {
                                res = res.slice(0, lastSlashIndex);
                                lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                            }
                            lastSlash = i;
                            dots = 0;
                            continue;
                        }
                        else if (res.length === 2 || res.length === 1) {
                            res = "";
                            lastSegmentLength = 0;
                            lastSlash = i;
                            dots = 0;
                            continue;
                        }
                    }
                    if (allowAboveRoot) {
                        if (res.length > 0)
                            res += `${separator}..`;
                        else
                            res = "..";
                        lastSegmentLength = 2;
                    }
                }
                else {
                    if (res.length > 0)
                        res += separator + path.slice(lastSlash + 1, i);
                    else
                        res = path.slice(lastSlash + 1, i);
                    lastSegmentLength = i - lastSlash - 1;
                }
                lastSlash = i;
                dots = 0;
            }
            else if (code === _constants_js_1.CHAR_DOT && dots !== -1) {
                ++dots;
            }
            else {
                dots = -1;
            }
        }
        return res;
    }
    exports.normalizeString = normalizeString;
    function _format(sep, pathObject) {
        const dir = pathObject.dir || pathObject.root;
        const base = pathObject.base ||
            (pathObject.name || "") + (pathObject.ext || "");
        if (!dir)
            return base;
        if (dir === pathObject.root)
            return dir + base;
        return dir + sep + base;
    }
    exports._format = _format;
    const WHITESPACE_ENCODINGS = {
        "\u0009": "%09",
        "\u000A": "%0A",
        "\u000B": "%0B",
        "\u000C": "%0C",
        "\u000D": "%0D",
        "\u0020": "%20",
    };
    function encodeWhitespace(string) {
        return string.replaceAll(/[\s]/g, (c) => {
            return WHITESPACE_ENCODINGS[c] ?? c;
        });
    }
    exports.encodeWhitespace = encodeWhitespace;
});
