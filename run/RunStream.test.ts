import { Stream } from "../Stream.ts";
import { assertEquals, assertRejects, Buffer } from "../test_deps.ts";
import { RunStream } from "./RunStream.ts";
import { MapTransform } from "../transform/MapTransform.ts";

Deno.test("Stream.runStream.outputBytes()", async () => {
  const runStream = Stream.run(`deno eval "console.log('is ok')"`);
  assertEquals(runStream.running, undefined);
  const out = await runStream.outputBytes();
  assertEquals(out, new Uint8Array([105, 115, 32, 111, 107, 10]));
  assertEquals(runStream.running?.processStatus?.code, 0);
});

Deno.test("Stream.run.outputString()", async () => {
  const runStream = Stream.run(`deno eval "console.log('is ok')"`);
  const out = await runStream.outputString();
  assertEquals(out, "is ok\n");
  assertEquals(runStream.running?.processStatus?.code, 0);
});

Deno.test("Stream.run.start()", async () => {
  const runStream = Stream.run(`deno eval "console.log('is ok')"`);
  const running = await runStream.start();
  await running.wait();
  assertEquals(running.processStatus?.code, 0);
});

Deno.test("Stream.run.wait()", async () => {
  const runStream = Stream.run(`deno eval "console.log('is ok')"`);
  const out = await runStream.wait();
  assertEquals(out.code, 0);
  assertEquals(runStream.running?.processStatus?.code, 0);
});

Deno.test("Stream.run().run().run()", async () => {
  const runStream = Stream
    .run("echo toto")
    .run("sed 's|o|a|g'")
    .run("sed 's|a|ii|g'");
  const out = await runStream.outputString();
  assertEquals(out, "tiitii\n");
  assertEquals(runStream.running?.processStatus?.code, 0);
  assertEquals(runStream.parentRunStream?.running?.processStatus?.code, 0);
  assertEquals(
    runStream.parentRunStream?.parentRunStream?.running?.processStatus?.code,
    0,
  );
  assertEquals(
    runStream.parentRunStream?.parentRunStream?.parentRunStream?.running
      ?.processStatus?.code,
    undefined,
  );
});

Deno.test("run(), start, run.run() check stdout piped", async () => {
  const runStream1 = Stream.run("echo toto");
  runStream1.start();
  const runStream2 = runStream1.run("sed 's|o|a|g'");
  await assertRejects(async () => {
    try {
      await runStream2.outputString();
    } finally {
      await runStream1.wait();
      await runStream2.wait();
    }
  });
});

Deno.test("run(), start, run.run()", async () => {
  const runStream1 = Stream.run("echo toto");
  runStream1.start({ stdout: "piped" });
  const runStream2 = runStream1.run("sed 's|o|a|g'");
  const out = await runStream2.outputString();
  assertEquals(out, "tata\n");
  assertEquals(runStream1.running?.processStatus?.code, 0);
  assertEquals(runStream2.running?.processStatus?.code, 0);
});

Deno.test("Stream.run.stdout()", async () => {
  const runStream = Stream.run(`deno eval "console.log('is ok')"`);
  const reader = runStream.getStdoutReadable().getReader();
  const buffer = new Buffer();
  let res;
  while (!res?.done) {
    res = await reader.read();
    if (res.value) {
      await buffer.write(res.value);
    }
  }
  assertEquals(new TextDecoder().decode(buffer.bytes()), "is ok\n");
  const status = await runStream.wait();
  assertEquals(status.code, 0);
});

Deno.test("Stream.run ThrowIfStdinError", async () => {
  const runStream = Stream
    .run(`deno eval "Deno.exit(12)"`)
    .run(`deno eval "console.log('is ok')"`);
  await assertRejects(async () => {
    try {
      await runStream.wait();
    } finally {
      await runStream.running?.process.close();
      await runStream.parentRunStream?.running?.process.close();
    }
  });
});

Deno.test("Stream.run ThrowIfRunFail", async () => {
  const runStream = Stream
    .run(`deno eval "console.log('is ok')"`)
    .run(`deno eval "Deno.exit(12)"`)
    .run(`deno eval "console.log('is ok')"`);
  await assertRejects(async () => {
    try {
      await runStream.wait();
    } finally {
      await runStream.running?.process.close();
      await runStream.parentRunStream?.running?.process.close();
    }
  });
});

Deno.test("runStream.log", async () => {
  const runStream = new RunStream(`deno eval "console.log('is ok')"`);
  await runStream.log().wait();
});

Deno.test("runStream.grep", async () => {
  const runStream = new RunStream(`deno eval "console.log('is ok')"`);
  const out = await runStream.grepo("ok").string();
  assertEquals(out, "ok");
});

Deno.test("runStream.map", async () => {
  const runStream = new RunStream(`deno eval "console.log('is\\n ok')"`);
  const out = await runStream.map((str) => str + "--").string();
  assertEquals(out, "is--\n ok--\n--");
});

Deno.test("runStream.array", async () => {
  const out = await new RunStream(`deno eval "console.log('is\\n ok')"`)
    .array();
  assertEquals(out, ["is", " ok"]);
});

Deno.test("runStream.array", async () => {
  const out = await new RunStream(`deno eval "console.log('is\\n ok')"`)
    .transform(new MapTransform((str) => str + "**"))
    .array();
  assertEquals(out, ["is**", " ok**", "**"]);
});

Deno.test("runStream.tap", async () => {
  const runStream = new RunStream(`deno eval "console.log('is\\n ok')"`);
  const array: string[] = [];
  const out = await runStream
    .tap((str) => array.push(str))
    .map((str) => str + "--").string();
  assertEquals(out, "is--\n ok--\n--");
  assertEquals(array, ["is", " ok", ""]);
});

Deno.test("runStream stdout === piped", async () => {
  const runStream = new RunStream(`deno eval "console.log('is\\n ok')"`);
  const runStreamRunning = runStream.start();
  await assertRejects(async () => {
    try {
      await runStream.lines().array();
    } finally {
      runStreamRunning.process.close();
    }
  });
});
