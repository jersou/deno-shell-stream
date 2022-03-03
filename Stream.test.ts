import { Stream } from "./Stream.ts";
import { assertEquals } from "./test_deps.ts";
import { arrayToStream } from "./utils/ArrayToStream.ts";

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
