import {
  ProcessEvent,
  ProcessEventListener,
  runKo,
  runOk,
  runToString,
  Stream,
  waitRun,
} from "./Stream.ts";
import { assertEquals } from "./test_deps.ts";

Deno.test("Stream.run.toBytes()", async () => {
  Stream.setVerbose(true);
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

Deno.test("Stream.subscribeProcessEvent", async () => {
  Stream.verbose = true;
  const events: ProcessEvent[] = [];
  const listener: ProcessEventListener = (event) => events.push(event);
  Stream.subscribeProcessEvent(listener);
  const runStream = Stream.fromRun(["bash", "-c", "sleep 0.1"]);
  assertEquals(events, []);
  await runStream.wait();
  assertEquals(events, [
    { processCount: 2, processDone: 1 },
    { processCount: 2, processDone: 2 },
  ]);
  Stream.unsubscribeProcessEvent(listener);
  await Stream.fromRun(["bash", "-c", "echo 1"]).wait();
  assertEquals(events, [
    { processCount: 2, processDone: 1 },
    { processCount: 2, processDone: 2 },
  ]);
});

Deno.test("waitRun", async () => {
  const out = await waitRun("echo 2");
  assertEquals(out.processStatus?.success, true);
});

Deno.test("runOk", async () => {
  assertEquals(await runOk("deno eval Deno.exit(0)"), true);
  assertEquals(await runOk("deno eval Deno.exit(1)"), false);
});

Deno.test("runKo", async () => {
  assertEquals(await runKo("deno eval Deno.exit(0)"), false);
  assertEquals(await runKo("deno eval Deno.exit(1)"), true);
});

Deno.test("cwd", async () => {
  assertEquals((await runToString("pwd")).trim(), Deno.cwd());
  Stream.setCwd(Deno.cwd() + "/test-data");
  assertEquals((await runToString("pwd")).trim(), Deno.cwd() + "/test-data");
});
