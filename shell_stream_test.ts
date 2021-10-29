import { assertEquals } from "./test_deps.ts";
import { map } from "./operators/map.ts";
import {
  FromArray,
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
  // TEST DATA=2
  const res = await FromFile("./shell_stream_test.ts")
    .grep(/\/\/ TEST DATA/)
    .cut("=", [1])
    .toString();
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
