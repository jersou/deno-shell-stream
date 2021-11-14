(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "deno.ns", "./test_deps.js", "./operators/map.js", "./shell_stream.js", "./startpoints/from_array.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const denoShim = (0, tslib_1.__importStar)(require("deno.ns"));
    const test_deps_js_1 = require("./test_deps.js");
    const map_js_1 = require("./operators/map.js");
    const shell_stream_js_1 = require("./shell_stream.js");
    const from_array_js_1 = require("./startpoints/from_array.js");
    denoShim.Deno.test("pipe", async () => {
        const res = await (0, shell_stream_js_1.FromArray)(["line1", "line2"])
            .pipe((0, map_js_1.map)((line) => line + ">"), (0, map_js_1.map)((line) => "<" + line))
            .toArray();
        (0, test_deps_js_1.assertEquals)(res, ["<line1>", "<line2>"]);
    });
    denoShim.Deno.test("log", async () => {
        const res = await (0, shell_stream_js_1.FromArray)(["line1", "line2"]).log().toArray();
        (0, test_deps_js_1.assertEquals)(res, ["line1", "line2"]);
    });
    denoShim.Deno.test("tap", async () => {
        const mutable = [];
        const res = await (0, shell_stream_js_1.FromArray)(["line1", "line2"])
            .tap((line) => mutable.push(line))
            .toArray();
        (0, test_deps_js_1.assertEquals)(res, ["line1", "line2"]);
        (0, test_deps_js_1.assertEquals)(mutable, ["line1", "line2"]);
    });
    denoShim.Deno.test("FromFile", async () => {
        const path = await denoShim.Deno.makeTempFile();
        await (0, shell_stream_js_1.FromArray)(["line1", "TEST DATA=2", "line3"]).toFile(path);
        const res = await (0, shell_stream_js_1.FromFile)(path)
            .grep(/TEST DATA/)
            .cut("=", [1])
            .toString();
        await denoShim.Deno.remove(path);
        (0, test_deps_js_1.assertEquals)(res, "2");
    });
    denoShim.Deno.test("toFile/FromFile", async () => {
        const tmpPath = await denoShim.Deno.makeTempFile();
        await (0, shell_stream_js_1.FromString)("line1\nline2").toFile(tmpPath);
        await (0, shell_stream_js_1.FromFile)(tmpPath).toFile(tmpPath);
        const res = await (0, shell_stream_js_1.FromFile)(tmpPath).toString();
        await denoShim.Deno.remove(tmpPath);
        (0, test_deps_js_1.assertEquals)(res, "line1\nline2");
    });
    denoShim.Deno.test("FromFile/closeBeforeStreaming", async () => {
        const tmpPath = await denoShim.Deno.makeTempFile();
        await (0, shell_stream_js_1.FromArray)(["line1", "line2"]).toFile(tmpPath);
        await (0, shell_stream_js_1.FromFile)(tmpPath, { closeBeforeStreaming: true })
            .map((line) => "mod-> " + line)
            .toFile(tmpPath);
        const res = await (0, shell_stream_js_1.FromFile)(tmpPath).toArray();
        await denoShim.Deno.remove(tmpPath);
        (0, test_deps_js_1.assertEquals)(res, ["mod-> line1", "mod-> line2"]);
    });
    denoShim.Deno.test("FromRun", async () => {
        const out = await (0, shell_stream_js_1.FromRun)([
            denoShim.Deno.execPath(),
            "eval",
            'console.log("lineFromRun")',
        ]).toString();
        (0, test_deps_js_1.assertEquals)(out, "lineFromRun");
    });
    denoShim.Deno.test("FromArray", async () => {
        const res = await (0, shell_stream_js_1.FromArray)(["line1", "line2"]).toArray();
        (0, test_deps_js_1.assertEquals)(res, ["line1", "line2"]);
    });
    denoShim.Deno.test("FromString", async () => {
        const res = await (0, shell_stream_js_1.FromString)("line1\nline2").toArray();
        (0, test_deps_js_1.assertEquals)(res, ["line1", "line2"]);
    });
    denoShim.Deno.test("run", async () => {
        const out = await (0, shell_stream_js_1.FromArray)(["line1", "line2"])
            .map((line) => line + "--")
            .toArray();
        (0, test_deps_js_1.assertEquals)(out, ["line1--", "line2--"]);
    });
    denoShim.Deno.test("Pipe", async () => {
        const res = await (0, shell_stream_js_1.Pipe)((0, from_array_js_1.fromArray)(["line1", "line2"]), (0, map_js_1.map)((line) => line + ">"), (0, map_js_1.map)((line) => "<" + line)).toArray();
        (0, test_deps_js_1.assertEquals)(res, ["<line1>", "<line2>"]);
    });
    denoShim.Deno.test("From", async () => {
        function* gen() {
            yield "line1";
            yield "line2";
        }
        const res = await (0, shell_stream_js_1.From)(gen()).toArray();
        (0, test_deps_js_1.assertEquals)(res, ["line1", "line2"]);
    });
    denoShim.Deno.test("From-async", async () => {
        async function* genAsync() {
            yield "line1async";
            yield "line2async";
        }
        const res = await (0, shell_stream_js_1.From)(genAsync()).toArray();
        (0, test_deps_js_1.assertEquals)(res, ["line1async", "line2async"]);
    });
    async function touch(path) {
        const file = await denoShim.Deno.open(path, { create: true, write: true });
        file.close();
    }
    denoShim.Deno.test("FromDir", async () => {
        const path = await denoShim.Deno.makeTempDir();
        await touch(`${path}/file1`);
        await touch(`${path}/file2`);
        const res = await (0, shell_stream_js_1.FromDir)(path).toArray();
        console.log(path);
        await denoShim.Deno.remove(path, { recursive: true });
        (0, test_deps_js_1.assertEquals)(res.sort(), ["file1", "file2"]);
    });
    denoShim.Deno.test("FromWalk", async () => {
        const path = await denoShim.Deno.makeTempDir();
        await touch(`${path}/file1`);
        await denoShim.Deno.mkdir(`${path}/dir`);
        await touch(`${path}/dir/file2`);
        const res = await (0, shell_stream_js_1.FromWalk)(path).toArray();
        console.log(path);
        await denoShim.Deno.remove(path, { recursive: true });
        (0, test_deps_js_1.assertEquals)(res.sort(), [
            path,
            `${path}/dir`,
            `${path}/dir/file2`,
            `${path}/file1`,
        ]);
    });
    denoShim.Deno.test("FromWalk-no-dir", async () => {
        const path = await denoShim.Deno.makeTempDir();
        await touch(`${path}/file1`);
        await denoShim.Deno.mkdir(`${path}/dir`);
        await touch(`${path}/dir/file2`);
        const res = await (0, shell_stream_js_1.FromWalk)(path, { includeDirs: false }).toArray();
        console.log(path);
        await denoShim.Deno.remove(path, { recursive: true });
        (0, test_deps_js_1.assertEquals)(res.sort(), [`${path}/dir/file2`, `${path}/file1`]);
    });
});
