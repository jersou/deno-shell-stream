import { Stream } from "./Stream.ts";
import { assertEquals } from "./test_deps.ts";

Deno.test("Stream.run.toBytes()", async () => {
  const runStream = Stream.fromRun(`deno eval "console.log('is ok')"`);
  assertEquals(runStream.process, undefined);
  const out = await runStream.toBytes();
  assertEquals(out, new Uint8Array([105, 115, 32, 111, 107, 10]));
  assertEquals(runStream.processStatus?.code, 0);
});

Deno.test("Stream.toArray", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const stream = Stream.fromArray(inputArray);
  assertEquals(stream!.linesStream!.locked, false);
  const out = await stream.toArray();
  assertEquals(out, inputArray);
});

Deno.test("Stream.fromFetch", async () => {
  const out = await Stream.fromFetch(
    "https://raw.githubusercontent.com/jersou/deno-shell-stream/main/.github/workflows/deno.yml",
  ).toString();
  assertEquals(out.split("\n").length, 38);
});

Deno.test("Stream.fromString", async () => {
  const out = await Stream.fromString("is\n ok\n").toArray();
  assertEquals(out, ["is", " ok"]);
});

Deno.test("Stream.fromFile", async () => {
  const out = await Stream.fromFile("test-data/file-1").toArray();
  assertEquals(out, ["test1"]);
});

Deno.test("Stream.fromFile opened", async () => {
  const file = await Deno.open("test-data/file-1", { read: true });
  const out = await Stream.fromFile(file).toArray();
  assertEquals(out, ["test1"]);
});

Deno.test("Stream.toIterable", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const iterable = Stream.fromArray(inputArray).toIterable();
  const out = [];
  for await (const str of iterable) {
    out.push(str);
  }
  assertEquals(out, ["line1", "line2", "line3"]);
});
