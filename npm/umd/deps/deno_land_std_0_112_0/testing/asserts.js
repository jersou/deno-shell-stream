(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "deno.ns", "../fmt/colors.js", "./_diff.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unreachable = exports.unimplemented = exports.assertThrowsAsync = exports.assertRejects = exports.assertThrows = exports.fail = exports.assertObjectMatch = exports.assertNotMatch = exports.assertMatch = exports.assertArrayIncludes = exports.assertStringIncludes = exports.assertExists = exports.assertNotStrictEquals = exports.assertStrictEquals = exports.assertNotEquals = exports.assertEquals = exports.assert = exports.equal = exports._format = exports.AssertionError = void 0;
    const tslib_1 = require("tslib");
    const denoShim = (0, tslib_1.__importStar)(require("deno.ns"));
    // Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
    // This module is browser compatible. Do not rely on good formatting of values
    // for AssertionError messages in browsers.
    const colors_js_1 = require("../fmt/colors.js");
    const _diff_js_1 = require("./_diff.js");
    const CAN_NOT_DISPLAY = "[Cannot display]";
    class AssertionError extends Error {
        constructor(message) {
            super(message);
            Object.defineProperty(this, "name", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: "AssertionError"
            });
        }
    }
    exports.AssertionError = AssertionError;
    /**
     * Converts the input into a string. Objects, Sets and Maps are sorted so as to
     * make tests less flaky
     * @param v Value to be formatted
     */
    function _format(v) {
        // deno-lint-ignore no-explicit-any
        const { Deno } = ({ ...denoShim, ...globalThis });
        return typeof Deno?.inspect === "function"
            ? Deno.inspect(v, {
                depth: Infinity,
                sorted: true,
                trailingComma: true,
                compact: false,
                iterableLimit: Infinity,
            })
            : `"${String(v).replace(/(?=["\\])/g, "\\")}"`;
    }
    exports._format = _format;
    /**
     * Colors the output of assertion diffs
     * @param diffType Difference type, either added or removed
     */
    function createColor(diffType, { background = false } = {}) {
        switch (diffType) {
            case _diff_js_1.DiffType.added:
                return (s) => background ? (0, colors_js_1.bgGreen)((0, colors_js_1.white)(s)) : (0, colors_js_1.green)((0, colors_js_1.bold)(s));
            case _diff_js_1.DiffType.removed:
                return (s) => background ? (0, colors_js_1.bgRed)((0, colors_js_1.white)(s)) : (0, colors_js_1.red)((0, colors_js_1.bold)(s));
            default:
                return colors_js_1.white;
        }
    }
    /**
     * Prefixes `+` or `-` in diff output
     * @param diffType Difference type, either added or removed
     */
    function createSign(diffType) {
        switch (diffType) {
            case _diff_js_1.DiffType.added:
                return "+   ";
            case _diff_js_1.DiffType.removed:
                return "-   ";
            default:
                return "    ";
        }
    }
    function buildMessage(diffResult, { stringDiff = false } = {}) {
        const messages = [], diffMessages = [];
        messages.push("");
        messages.push("");
        messages.push(`    ${(0, colors_js_1.gray)((0, colors_js_1.bold)("[Diff]"))} ${(0, colors_js_1.red)((0, colors_js_1.bold)("Actual"))} / ${(0, colors_js_1.green)((0, colors_js_1.bold)("Expected"))}`);
        messages.push("");
        messages.push("");
        diffResult.forEach((result) => {
            const c = createColor(result.type);
            const line = result.details?.map((detail) => detail.type !== _diff_js_1.DiffType.common
                ? createColor(detail.type, { background: true })(detail.value)
                : detail.value).join("") ?? result.value;
            diffMessages.push(c(`${createSign(result.type)}${line}`));
        });
        messages.push(...(stringDiff ? [diffMessages.join("")] : diffMessages));
        messages.push("");
        return messages;
    }
    function isKeyedCollection(x) {
        return [Symbol.iterator, "size"].every((k) => k in x);
    }
    /**
     * Deep equality comparison used in assertions
     * @param c actual value
     * @param d expected value
     */
    function equal(c, d) {
        const seen = new Map();
        return (function compare(a, b) {
            // Have to render RegExp & Date for string comparison
            // unless it's mistreated as object
            if (a &&
                b &&
                ((a instanceof RegExp && b instanceof RegExp) ||
                    (a instanceof URL && b instanceof URL))) {
                return String(a) === String(b);
            }
            if (a instanceof Date && b instanceof Date) {
                const aTime = a.getTime();
                const bTime = b.getTime();
                // Check for NaN equality manually since NaN is not
                // equal to itself.
                if (Number.isNaN(aTime) && Number.isNaN(bTime)) {
                    return true;
                }
                return a.getTime() === b.getTime();
            }
            if (Object.is(a, b)) {
                return true;
            }
            if (a && typeof a === "object" && b && typeof b === "object") {
                if (a && b && !constructorsEqual(a, b)) {
                    return false;
                }
                if (a instanceof WeakMap || b instanceof WeakMap) {
                    if (!(a instanceof WeakMap && b instanceof WeakMap))
                        return false;
                    throw new TypeError("cannot compare WeakMap instances");
                }
                if (a instanceof WeakSet || b instanceof WeakSet) {
                    if (!(a instanceof WeakSet && b instanceof WeakSet))
                        return false;
                    throw new TypeError("cannot compare WeakSet instances");
                }
                if (seen.get(a) === b) {
                    return true;
                }
                if (Object.keys(a || {}).length !== Object.keys(b || {}).length) {
                    return false;
                }
                if (isKeyedCollection(a) && isKeyedCollection(b)) {
                    if (a.size !== b.size) {
                        return false;
                    }
                    let unmatchedEntries = a.size;
                    for (const [aKey, aValue] of a.entries()) {
                        for (const [bKey, bValue] of b.entries()) {
                            /* Given that Map keys can be references, we need
                             * to ensure that they are also deeply equal */
                            if ((aKey === aValue && bKey === bValue && compare(aKey, bKey)) ||
                                (compare(aKey, bKey) && compare(aValue, bValue))) {
                                unmatchedEntries--;
                            }
                        }
                    }
                    return unmatchedEntries === 0;
                }
                const merged = { ...a, ...b };
                for (const key of [
                    ...Object.getOwnPropertyNames(merged),
                    ...Object.getOwnPropertySymbols(merged),
                ]) {
                    if (!compare(a && a[key], b && b[key])) {
                        return false;
                    }
                    if (((key in a) && (!(key in b))) || ((key in b) && (!(key in a)))) {
                        return false;
                    }
                }
                seen.set(a, b);
                if (a instanceof WeakRef || b instanceof WeakRef) {
                    if (!(a instanceof WeakRef && b instanceof WeakRef))
                        return false;
                    return compare(a.deref(), b.deref());
                }
                return true;
            }
            return false;
        })(c, d);
    }
    exports.equal = equal;
    // deno-lint-ignore ban-types
    function constructorsEqual(a, b) {
        return a.constructor === b.constructor ||
            a.constructor === Object && !b.constructor ||
            !a.constructor && b.constructor === Object;
    }
    /** Make an assertion, error will be thrown if `expr` does not have truthy value. */
    function assert(expr, msg = "") {
        if (!expr) {
            throw new AssertionError(msg);
        }
    }
    exports.assert = assert;
    function assertEquals(actual, expected, msg) {
        if (equal(actual, expected)) {
            return;
        }
        let message = "";
        const actualString = _format(actual);
        const expectedString = _format(expected);
        try {
            const stringDiff = (typeof actual === "string") &&
                (typeof expected === "string");
            const diffResult = stringDiff
                ? (0, _diff_js_1.diffstr)(actual, expected)
                : (0, _diff_js_1.diff)(actualString.split("\n"), expectedString.split("\n"));
            const diffMsg = buildMessage(diffResult, { stringDiff }).join("\n");
            message = `Values are not equal:\n${diffMsg}`;
        }
        catch {
            message = `\n${(0, colors_js_1.red)(CAN_NOT_DISPLAY)} + \n\n`;
        }
        if (msg) {
            message = msg;
        }
        throw new AssertionError(message);
    }
    exports.assertEquals = assertEquals;
    function assertNotEquals(actual, expected, msg) {
        if (!equal(actual, expected)) {
            return;
        }
        let actualString;
        let expectedString;
        try {
            actualString = String(actual);
        }
        catch {
            actualString = "[Cannot display]";
        }
        try {
            expectedString = String(expected);
        }
        catch {
            expectedString = "[Cannot display]";
        }
        if (!msg) {
            msg = `actual: ${actualString} expected: ${expectedString}`;
        }
        throw new AssertionError(msg);
    }
    exports.assertNotEquals = assertNotEquals;
    function assertStrictEquals(actual, expected, msg) {
        if (actual === expected) {
            return;
        }
        let message;
        if (msg) {
            message = msg;
        }
        else {
            const actualString = _format(actual);
            const expectedString = _format(expected);
            if (actualString === expectedString) {
                const withOffset = actualString
                    .split("\n")
                    .map((l) => `    ${l}`)
                    .join("\n");
                message =
                    `Values have the same structure but are not reference-equal:\n\n${(0, colors_js_1.red)(withOffset)}\n`;
            }
            else {
                try {
                    const stringDiff = (typeof actual === "string") &&
                        (typeof expected === "string");
                    const diffResult = stringDiff
                        ? (0, _diff_js_1.diffstr)(actual, expected)
                        : (0, _diff_js_1.diff)(actualString.split("\n"), expectedString.split("\n"));
                    const diffMsg = buildMessage(diffResult, { stringDiff }).join("\n");
                    message = `Values are not strictly equal:\n${diffMsg}`;
                }
                catch {
                    message = `\n${(0, colors_js_1.red)(CAN_NOT_DISPLAY)} + \n\n`;
                }
            }
        }
        throw new AssertionError(message);
    }
    exports.assertStrictEquals = assertStrictEquals;
    function assertNotStrictEquals(actual, expected, msg) {
        if (actual !== expected) {
            return;
        }
        throw new AssertionError(msg ?? `Expected "actual" to be strictly unequal to: ${_format(actual)}\n`);
    }
    exports.assertNotStrictEquals = assertNotStrictEquals;
    /**
     * Make an assertion that actual is not null or undefined.
     * If not then throw.
     */
    function assertExists(actual, msg) {
        if (actual === undefined || actual === null) {
            if (!msg) {
                msg = `actual: "${actual}" expected to not be null or undefined`;
            }
            throw new AssertionError(msg);
        }
    }
    exports.assertExists = assertExists;
    /**
     * Make an assertion that actual includes expected. If not
     * then throw.
     */
    function assertStringIncludes(actual, expected, msg) {
        if (!actual.includes(expected)) {
            if (!msg) {
                msg = `actual: "${actual}" expected to contain: "${expected}"`;
            }
            throw new AssertionError(msg);
        }
    }
    exports.assertStringIncludes = assertStringIncludes;
    function assertArrayIncludes(actual, expected, msg) {
        const missing = [];
        for (let i = 0; i < expected.length; i++) {
            let found = false;
            for (let j = 0; j < actual.length; j++) {
                if (equal(expected[i], actual[j])) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                missing.push(expected[i]);
            }
        }
        if (missing.length === 0) {
            return;
        }
        if (!msg) {
            msg = `actual: "${_format(actual)}" expected to include: "${_format(expected)}"\nmissing: ${_format(missing)}`;
        }
        throw new AssertionError(msg);
    }
    exports.assertArrayIncludes = assertArrayIncludes;
    /**
     * Make an assertion that `actual` match RegExp `expected`. If not
     * then throw.
     */
    function assertMatch(actual, expected, msg) {
        if (!expected.test(actual)) {
            if (!msg) {
                msg = `actual: "${actual}" expected to match: "${expected}"`;
            }
            throw new AssertionError(msg);
        }
    }
    exports.assertMatch = assertMatch;
    /**
     * Make an assertion that `actual` not match RegExp `expected`. If match
     * then throw.
     */
    function assertNotMatch(actual, expected, msg) {
        if (expected.test(actual)) {
            if (!msg) {
                msg = `actual: "${actual}" expected to not match: "${expected}"`;
            }
            throw new AssertionError(msg);
        }
    }
    exports.assertNotMatch = assertNotMatch;
    /**
     * Make an assertion that `actual` object is a subset of `expected` object, deeply.
     * If not, then throw.
     */
    function assertObjectMatch(
    // deno-lint-ignore no-explicit-any
    actual, expected) {
        const seen = new WeakMap();
        function filter(a, b) {
            // Prevent infinite loop with circular references with same filter
            if ((seen.has(a)) && (seen.get(a) === b)) {
                return a;
            }
            seen.set(a, b);
            // Filter keys and symbols which are present in both actual and expected
            const filtered = {};
            const entries = [
                ...Object.getOwnPropertyNames(a),
                ...Object.getOwnPropertySymbols(a),
            ]
                .filter((key) => key in b)
                .map((key) => [key, a[key]]);
            for (const [key, value] of entries) {
                // On array references, build a filtered array and filter nested objects inside
                if (Array.isArray(value)) {
                    const subset = b[key];
                    if (Array.isArray(subset)) {
                        filtered[key] = value
                            .slice(0, subset.length)
                            .map((element, index) => {
                            const subsetElement = subset[index];
                            if ((typeof subsetElement === "object") && (subsetElement)) {
                                return filter(element, subsetElement);
                            }
                            return element;
                        });
                        continue;
                    }
                } // On nested objects references, build a filtered object recursively
                else if (typeof value === "object") {
                    const subset = b[key];
                    if ((typeof subset === "object") && (subset)) {
                        filtered[key] = filter(value, subset);
                        continue;
                    }
                }
                filtered[key] = value;
            }
            return filtered;
        }
        return assertEquals(
        // get the intersection of "actual" and "expected"
        // side effect: all the instances' constructor field is "Object" now.
        filter(actual, expected), 
        // set (nested) instances' constructor field to be "Object" without changing expected value.
        // see https://github.com/denoland/deno_std/pull/1419
        filter(expected, expected));
    }
    exports.assertObjectMatch = assertObjectMatch;
    /**
     * Forcefully throws a failed assertion
     */
    function fail(msg) {
        assert(false, `Failed assertion${msg ? `: ${msg}` : "."}`);
    }
    exports.fail = fail;
    function assertThrows(fn, errorClassOrCallback, msgIncludesOrMsg, msg) {
        let ErrorClass;
        let msgIncludes;
        let errorCallback;
        if (errorClassOrCallback == null ||
            errorClassOrCallback.prototype instanceof Error ||
            errorClassOrCallback.prototype === Error.prototype) {
            ErrorClass = errorClassOrCallback;
            msgIncludes = msgIncludesOrMsg;
            errorCallback = null;
        }
        else {
            ErrorClass = null;
            msgIncludes = null;
            errorCallback = errorClassOrCallback;
            msg = msgIncludesOrMsg;
        }
        let doesThrow = false;
        let error = null;
        try {
            fn();
        }
        catch (e) {
            if (e instanceof Error === false) {
                throw new AssertionError("A non-Error object was thrown.");
            }
            if (ErrorClass && !(e instanceof ErrorClass)) {
                msg = `Expected error to be instance of "${ErrorClass.name}", but was "${typeof e === "object" ? e?.constructor?.name : "[not an object]"}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            if (msgIncludes && (!(e instanceof Error) ||
                !(0, colors_js_1.stripColor)(e.message).includes((0, colors_js_1.stripColor)(msgIncludes)))) {
                msg = `Expected error message to include "${msgIncludes}", but got "${e instanceof Error ? e.message : "[not an Error]"}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            doesThrow = true;
            error = e;
        }
        if (!doesThrow) {
            msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
            throw new AssertionError(msg);
        }
        if (typeof errorCallback == "function") {
            errorCallback(error);
        }
    }
    exports.assertThrows = assertThrows;
    async function assertRejects(fn, errorClassOrCallback, msgIncludesOrMsg, msg) {
        let ErrorClass;
        let msgIncludes;
        let errorCallback;
        if (errorClassOrCallback == null ||
            errorClassOrCallback.prototype instanceof Error ||
            errorClassOrCallback.prototype === Error.prototype) {
            ErrorClass = errorClassOrCallback;
            msgIncludes = msgIncludesOrMsg;
            errorCallback = null;
        }
        else {
            ErrorClass = null;
            msgIncludes = null;
            errorCallback = errorClassOrCallback;
            msg = msgIncludesOrMsg;
        }
        let doesThrow = false;
        let error = null;
        try {
            await fn();
        }
        catch (e) {
            if (e instanceof Error === false) {
                throw new AssertionError("A non-Error object was thrown or rejected.");
            }
            if (ErrorClass && !(e instanceof ErrorClass)) {
                msg = `Expected error to be instance of "${ErrorClass.name}", but was "${typeof e === "object" ? e?.constructor?.name : "[not an object]"}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            if (msgIncludes && (!(e instanceof Error) ||
                !(0, colors_js_1.stripColor)(e.message).includes((0, colors_js_1.stripColor)(msgIncludes)))) {
                msg = `Expected error message to include "${msgIncludes}", but got "${e instanceof Error ? e.message : "[not an Error]"}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            doesThrow = true;
            error = e;
        }
        if (!doesThrow) {
            msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
            throw new AssertionError(msg);
        }
        if (typeof errorCallback == "function") {
            errorCallback(error);
        }
    }
    exports.assertRejects = assertRejects;
    exports.assertThrowsAsync = assertRejects;
    /** Use this to stub out methods that will throw when invoked. */
    function unimplemented(msg) {
        throw new AssertionError(msg || "unimplemented");
    }
    exports.unimplemented = unimplemented;
    /** Use this to assert unreachable code. */
    function unreachable() {
        throw new AssertionError("unreachable");
    }
    exports.unreachable = unreachable;
});
