import * as denoShim from "deno.ns";
import { assertEquals } from "./test_deps.js";
import { map } from "./operators/map.js";
import {
  FromArray,
  FromFile,
  FromRun,
  FromString,
  Pipe,
} from "./shell_stream.js";
import { fromArray } from "./startpoints/from_array.js";

denoShim.Deno.test("pipe", async () => {
  const res = await FromArray(["line1", "line2"])
    .pipe(
      map((line: string) => line + ">"),
      map((line: string) => "<" + line),
    )
    .toArray();
  assertEquals(res, ["<line1>", "<line2>"]);
});

denoShim.Deno.test("log", async () => {
  const res = await FromArray(["line1", "line2"]).log().toArray();
  assertEquals(res, ["line1", "line2"]);
});

denoShim.Deno.test("tap", async () => {
  const mutable: string[] = [];
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
  const res = await Pipe(
    fromArray(["line1", "line2"]),
    map((line: string) => line + ">"),
    map((line: string) => "<" + line),
  ).toArray();
  assertEquals(res, ["<line1>", "<line2>"]);
});
