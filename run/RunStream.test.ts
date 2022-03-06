import { Stream } from "../Stream.ts";
import { assertEquals, assertRejects, Buffer } from "../test_deps.ts";
import { getParentRun, getRunStream, RunStream } from "./RunStream.ts";
import { MapTransform } from "../transform/MapTransform.ts";

Deno.test("Stream.fromRunStream.toBytes()", async () => {
  const runStream = Stream.fromRun(`deno eval "console.log('is ok')"`);
  assertEquals(runStream.process, undefined);
  const out = await runStream.toBytes();
  assertEquals(out, new Uint8Array([105, 115, 32, 111, 107, 10]));
  assertEquals(runStream.processStatus?.code, 0);
});

Deno.test("Stream.fromRun.outputString()", async () => {
  const runStream = Stream.fromRun(`deno eval "console.log('is ok')"`);
  const out = await runStream.toString();
  assertEquals(out, "is ok\n");
  assertEquals(runStream.processStatus?.code, 0);
});

Deno.test("Stream.fromRun.start()", async () => {
  const runStream = Stream.fromRun(`deno eval "console.log('is ok')"`);
  const running = await runStream.start();
  await running.wait();
  assertEquals(running.processStatus?.code, 0);
});

Deno.test("Stream.fromRun.wait()", async () => {
  const runStream = Stream.fromRun(`deno eval "console.log('is ok')"`);
  await runStream.wait();
  assertEquals(runStream.processStatus!.code, 0);
});

Deno.test("Stream.fromRun().run().run()", async () => {
  const runStream = Stream
    .fromRun("echo toto")
    .run("sed 's|o|a|g'")
    .run("sed 's|a|ii|g'");
  const out = await runStream.toString();
  assertEquals(out, "tiitii\n");
  assertEquals(runStream.processStatus?.code, 0);
  assertEquals(getParentRun(runStream)?.processStatus?.code, 0);
  assertEquals(
    getParentRun(getParentRun(runStream))?.processStatus?.code,
    0,
  );
  assertEquals(
    getParentRun(getParentRun(getParentRun(runStream)))?.processStatus?.code,
    undefined,
  );
});

Deno.test("run(), start, run.run() check stdout piped", async () => {
  const runStream1 = Stream.fromRun("echo toto");
  runStream1.start();
  const runStream2 = runStream1.run("sed 's|o|a|g'");
  await assertRejects(async () => {
    try {
      await runStream2.toString();
    } finally {
      await runStream1.wait();
      await runStream2.wait();
    }
  });
});

Deno.test("run(), start, run.run()", async () => {
  const runStream1 = Stream.fromRun("echo toto");
  runStream1.start({ stdout: "piped" });
  const runStream2 = runStream1.run("sed 's|o|a|g'");
  const out = await runStream2.toString();
  assertEquals(out, "tata\n");
  assertEquals(runStream1.processStatus?.code, 0);
  assertEquals(runStream2.processStatus?.code, 0);
});

Deno.test("Stream.fromRun.stdout()", async () => {
  const runStream = Stream.fromRun(`deno eval "console.log('is ok')"`);
  const reader = runStream.toByteReadableStream().getReader();
  const buffer = new Buffer();
  let res;
  while (!res?.done) {
    res = await reader.read();
    if (res.value) {
      await buffer.write(res.value);
    }
  }
  assertEquals(new TextDecoder().decode(buffer.bytes()), "is ok\n");
  await runStream.wait();
  assertEquals(runStream.processStatus!.code, 0);
});

Deno.test("Stream.fromRun", async () => {
  const runStream = Stream
    .fromRun(`deno eval "Deno.exit(12)"`)
    .run(`deno eval "console.log('is ok')"`);
  await assertRejects(async () => {
    try {
      await runStream.wait();
    } finally {
      await runStream.process!.close();
      await getParentRun(runStream)?.process!.close();
    }
  });
});

Deno.test("Stream.fromRun dontThrowIfRunFail", async () => {
  const runStream = Stream
    .fromRun(`deno eval "Deno.exit(12)"`, { dontThrowIfRunFail: true })
    .run(`deno eval "console.log('is ok')"`);

  const stream = await runStream.wait();
  assertEquals(stream.processStatus?.code, 0);
  assertEquals(getParentRun(stream)?.processStatus?.code, 12);
});

Deno.test("Stream.fromRun ThrowIfRunFail", async () => {
  const runStream = Stream
    .fromRun(`deno eval "console.log('is ok')"`)
    .run(`deno eval "Deno.exit(12)"`)
    .run(`deno eval "console.log('is ok')"`);
  await assertRejects(async () => {
    try {
      await runStream.wait();
    } finally {
      await runStream.process!.close();
      await getParentRun(runStream)?.process!.close();
    }
  });
});

Deno.test("runStream.log", async () => {
  const runStream = new RunStream(`deno eval "console.log('is ok')"`);
  await runStream.log().wait();
});

Deno.test("runStream.grep", async () => {
  const runStream = new RunStream(`deno eval "console.log('is ok')"`);
  const out = await runStream.grepo("ok").toString();
  assertEquals(out, "ok");
});

Deno.test("runStream.map", async () => {
  const runStream = new RunStream(`deno eval "console.log('is\\n ok')"`);
  const out = await runStream.map((str) => str + "--").toString();
  assertEquals(out, "is--\n ok--\n--");
});

Deno.test("runStream.toArray", async () => {
  const out = await new RunStream(`deno eval "console.log('is\\n ok')"`)
    .toArray();
  assertEquals(out, ["is", " ok"]);
});

Deno.test("runStream.toArray", async () => {
  const out = await new RunStream(`deno eval "console.log('is\\n ok')"`)
    .transform(new MapTransform((str) => str + "**"))
    .toArray();
  assertEquals(out, ["is**", " ok**", "**"]);
});

Deno.test("runStream.tap", async () => {
  const runStream = new RunStream(`deno eval "console.log('is\\n ok')"`);
  const array: string[] = [];
  const out = await runStream
    .tap((str) => array.push(str))
    .map((str) => str + "--").toString();
  assertEquals(out, "is--\n ok--\n--");
  assertEquals(array, ["is", " ok", ""]);
});

Deno.test("runStream stdout === piped", async () => {
  const runStream = new RunStream(`deno eval "console.log('is\\n ok')"`);
  runStream.start();
  await assertRejects(async () => {
    try {
      await runStream.toArray();
    } finally {
      runStream.process!.close();
    }
  });
});

Deno.test("runStream.toFile", async () => {
  await Deno.mkdir("tmp", { recursive: true });
  await new RunStream(`deno eval "console.log('is\\n ok')"`)
    .toFile("tmp/tmp-runStream-toFile");
  const out = await Deno.readTextFile("tmp/tmp-runStream-toFile");
  assertEquals(out, "is\n ok\n");
});

Deno.test("runStream.toFile opened", async () => {
  await Deno.mkdir("tmp", { recursive: true });
  const file = await Deno.open("tmp/tmp-runStream-toFile", { write: true });
  await new RunStream(`deno eval "console.log('is\\n ok')"`)
    .toFile(file);
  const out = await Deno.readTextFile("tmp/tmp-runStream-toFile");
  assertEquals(out, "is\n ok\n");
});

Deno.test("getRunStream", async () => {
  const runStream = new RunStream(`deno eval "console.log('is ok')"`);
  await runStream.log().wait();
  assertEquals(getRunStream(runStream), runStream);
  const arrayStream = await Stream.fromArray([]).wait();
  assertEquals(getRunStream(arrayStream), undefined);
});

// Deno.test("exitCodeIfRunFail", async () => {
//   await Stream.fromRun(["bash", "-c", "exit 1"], { exitCodeIfRunFail: 2 })
//     .wait();
// });
