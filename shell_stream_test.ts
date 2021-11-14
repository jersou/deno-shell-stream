import { assertEquals } from "./test_deps.ts";
import { map } from "./operators/map.ts";
import {
  From,
  FromArray,
  FromDir,
  FromFile,
  FromRun,
  FromString,
  Pipe,
} from "./shell_stream.ts";
import { fromArray } from "./startpoints/from_array.ts";

Deno.test("pipe", async () => {
  const res = await FromArray(["line1", "line2"])
    .pipe(
      map((line: string) => line + ">"),
      map((line: string) => "<" + line),
    )
    .toArray();
  assertEquals(res, ["<line1>", "<line2>"]);
});

Deno.test("log", async () => {
  const res = await FromArray(["line1", "line2"]).log().toArray();
  assertEquals(res, ["line1", "line2"]);
});

Deno.test("tap", async () => {
  const mutable: string[] = [];
  const res = await FromArray(["line1", "line2"])
    .tap((line) => mutable.push(line))
    .toArray();
  assertEquals(res, ["line1", "line2"]);
  assertEquals(mutable, ["line1", "line2"]);
});

Deno.test("FromFile", async () => {
  const path = await Deno.makeTempFile();
  await FromArray(["line1", "TEST DATA=2", "line3"]).toFile(path);
  const res = await FromFile(path)
    .grep(/TEST DATA/)
    .cut("=", [1])
    .toString();
  await Deno.remove(path);
  assertEquals(res, "2");
});

Deno.test("toFile/FromFile", async () => {
  const tmpPath = await Deno.makeTempFile();
  await FromString("line1\nline2").toFile(tmpPath);
  await FromFile(tmpPath).toFile(tmpPath);
  const res = await FromFile(tmpPath).toString();
  await Deno.remove(tmpPath);
  assertEquals(res, "line1\nline2");
});

Deno.test("FromFile/closeBeforeStreaming", async () => {
  const tmpPath = await Deno.makeTempFile();
  await FromArray(["line1", "line2"]).toFile(tmpPath);
  await FromFile(tmpPath, { closeBeforeStreaming: true })
    .map((line) => "mod-> " + line)
    .toFile(tmpPath);
  const res = await FromFile(tmpPath).toArray();
  await Deno.remove(tmpPath);
  assertEquals(res, ["mod-> line1", "mod-> line2"]);
});

Deno.test("FromRun", async () => {
  const out = await FromRun([
    Deno.execPath(),
    "eval",
    'console.log("lineFromRun")',
  ]).toString();
  assertEquals(out, "lineFromRun");
});

Deno.test("FromArray", async () => {
  const res = await FromArray(["line1", "line2"]).toArray();
  assertEquals(res, ["line1", "line2"]);
});

Deno.test("FromString", async () => {
  const res = await FromString("line1\nline2").toArray();
  assertEquals(res, ["line1", "line2"]);
});

Deno.test("run", async () => {
  const out = await FromArray(["line1", "line2"])
    .map((line) => line + "--")
    .toArray();
  assertEquals(out, ["line1--", "line2--"]);
});

Deno.test("Pipe", async () => {
  const res = await Pipe(
    fromArray(["line1", "line2"]),
    map((line: string) => line + ">"),
    map((line: string) => "<" + line),
  ).toArray();
  assertEquals(res, ["<line1>", "<line2>"]);
});

Deno.test("From", async () => {
  function* gen() {
    yield "line1";
    yield "line2";
  }
  const res = await From(gen()).toArray();
  assertEquals(res, ["line1", "line2"]);
});

Deno.test("From", async () => {
  async function* genAsync() {
    yield "line1async";
    yield "line2async";
  }
  const res = await From(genAsync()).toArray();
  assertEquals(res, ["line1async", "line2async"]);
});

async function touch(path: string) {
  const file = await Deno.open(path, { create: true, write: true });
  file.close();
}

Deno.test("FromDir", async () => {
  const path = await Deno.makeTempDir();
  await touch(`${path}/file1`);
  await touch(`${path}/file2`);
  const res = await FromDir(path).toArray();
  console.log(path);
  await Deno.remove(path, { recursive: true });
  assertEquals(res.sort(), ["file1", "file2"]);
});
