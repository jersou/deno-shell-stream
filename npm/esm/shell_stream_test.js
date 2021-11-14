import * as denoShim from "deno.ns";
import { assertEquals } from "./test_deps.js";
import { map } from "./operators/map.js";
import { From, FromArray, FromDir, FromFile, FromRun, FromString, FromWalk, Pipe, } from "./shell_stream.js";
import { fromArray } from "./startpoints/from_array.js";
denoShim.Deno.test("pipe", async () => {
    const res = await FromArray(["line1", "line2"])
        .pipe(map((line) => line + ">"), map((line) => "<" + line))
        .toArray();
    assertEquals(res, ["<line1>", "<line2>"]);
});
denoShim.Deno.test("log", async () => {
    const res = await FromArray(["line1", "line2"]).log().toArray();
    assertEquals(res, ["line1", "line2"]);
});
denoShim.Deno.test("tap", async () => {
    const mutable = [];
    const res = await FromArray(["line1", "line2"])
        .tap((line) => mutable.push(line))
        .toArray();
    assertEquals(res, ["line1", "line2"]);
    assertEquals(mutable, ["line1", "line2"]);
});
denoShim.Deno.test("FromFile", async () => {
    const path = await denoShim.Deno.makeTempFile();
    await FromArray(["line1", "TEST DATA=2", "line3"]).toFile(path);
    const res = await FromFile(path)
        .grep(/TEST DATA/)
        .cut("=", [1])
        .toString();
    await denoShim.Deno.remove(path);
    assertEquals(res, "2");
});
denoShim.Deno.test("toFile/FromFile", async () => {
    const tmpPath = await denoShim.Deno.makeTempFile();
    await FromString("line1\nline2").toFile(tmpPath);
    await FromFile(tmpPath).toFile(tmpPath);
    const res = await FromFile(tmpPath).toString();
    await denoShim.Deno.remove(tmpPath);
    assertEquals(res, "line1\nline2");
});
denoShim.Deno.test("FromFile/closeBeforeStreaming", async () => {
    const tmpPath = await denoShim.Deno.makeTempFile();
    await FromArray(["line1", "line2"]).toFile(tmpPath);
    await FromFile(tmpPath, { closeBeforeStreaming: true })
        .map((line) => "mod-> " + line)
        .toFile(tmpPath);
    const res = await FromFile(tmpPath).toArray();
    await denoShim.Deno.remove(tmpPath);
    assertEquals(res, ["mod-> line1", "mod-> line2"]);
});
denoShim.Deno.test("FromRun", async () => {
    const out = await FromRun([
        denoShim.Deno.execPath(),
        "eval",
        'console.log("lineFromRun")',
    ]).toString();
    assertEquals(out, "lineFromRun");
});
denoShim.Deno.test("FromArray", async () => {
    const res = await FromArray(["line1", "line2"]).toArray();
    assertEquals(res, ["line1", "line2"]);
});
denoShim.Deno.test("FromString", async () => {
    const res = await FromString("line1\nline2").toArray();
    assertEquals(res, ["line1", "line2"]);
});
denoShim.Deno.test("run", async () => {
    const out = await FromArray(["line1", "line2"])
        .map((line) => line + "--")
        .toArray();
    assertEquals(out, ["line1--", "line2--"]);
});
denoShim.Deno.test("Pipe", async () => {
    const res = await Pipe(fromArray(["line1", "line2"]), map((line) => line + ">"), map((line) => "<" + line)).toArray();
    assertEquals(res, ["<line1>", "<line2>"]);
});
denoShim.Deno.test("From", async () => {
    function* gen() {
        yield "line1";
        yield "line2";
    }
    const res = await From(gen()).toArray();
    assertEquals(res, ["line1", "line2"]);
});
denoShim.Deno.test("From-async", async () => {
    async function* genAsync() {
        yield "line1async";
        yield "line2async";
    }
    const res = await From(genAsync()).toArray();
    assertEquals(res, ["line1async", "line2async"]);
});
async function touch(path) {
    const file = await denoShim.Deno.open(path, { create: true, write: true });
    file.close();
}
denoShim.Deno.test("FromDir", async () => {
    const path = await denoShim.Deno.makeTempDir();
    await touch(`${path}/file1`);
    await touch(`${path}/file2`);
    const res = await FromDir(path).toArray();
    console.log(path);
    await denoShim.Deno.remove(path, { recursive: true });
    assertEquals(res.sort(), ["file1", "file2"]);
});
denoShim.Deno.test("FromWalk", async () => {
    const path = await denoShim.Deno.makeTempDir();
    await touch(`${path}/file1`);
    await denoShim.Deno.mkdir(`${path}/dir`);
    await touch(`${path}/dir/file2`);
    const res = await FromWalk(path).toArray();
    console.log(path);
    await denoShim.Deno.remove(path, { recursive: true });
    assertEquals(res.sort(), [
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
    const res = await FromWalk(path, { includeDirs: false }).toArray();
    console.log(path);
    await denoShim.Deno.remove(path, { recursive: true });
    assertEquals(res.sort(), [`${path}/dir/file2`, `${path}/file1`]);
});
