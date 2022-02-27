import { Stream } from "./Stream.ts";
import { assertEquals } from "./test_deps.ts";

Deno.test("Stream.run.outputBytes()", async () => {
  const runStream = Stream.run(`deno eval "console.log('is ok')"`);
  assertEquals(runStream.running, undefined);
  const out = await runStream.outputBytes();
  assertEquals(out, new Uint8Array([105, 115, 32, 111, 107, 10]));
  assertEquals(runStream.running?.processStatus?.code, 0);
});

Deno.test("Stream.array", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const lineStream = Stream.array(inputArray);
  assertEquals(lineStream.linesStream.locked, false);
  const out = await lineStream.array();
  assertEquals(out, inputArray);
});
