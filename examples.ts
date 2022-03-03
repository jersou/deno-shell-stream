#!/usr/bin/env -S deno run -A

import { Stream } from "./Stream.ts";
import { sanitize } from "./utils/sanitize.ts";
import { getParentRun } from "./run/RunStream.ts";

const outStr = await Stream
  .fromRun(`deno eval "console.log('is ok - toString')"`)
  .toString();
console.log({ outStr });
console.log("-------------------------------------------------------------");

const status = await Stream
  .fromRun(`deno eval "console.log('is ok - wait')"`)
  .wait();
console.log({ status });
console.log("-------------------------------------------------------------");

const runStream = Stream
  .fromRun("echo toto")
  .run("sed 's|o|a|g'")
  .run("sed 's|a|ii|g'");
const outRunStream = await runStream.toString();
console.log({
  outRunStream,
  exitCodes: [
    runStream.processStatus?.code,
    getParentRun(runStream)?.processStatus?.code,
    getParentRun(getParentRun(runStream))?.processStatus?.code,
  ],
});
console.log("-------------------------------------------------------------");

const errorRunStream = Stream
  .fromRun("echo toto")
  .run(["bash", "-c", "exit 12"], {
    dontThrowIfStdinError: true,
    dontThrowIfRunFail: true,
  })
  .run("echo titi");
const outErrorRunStream = await errorRunStream.toString();
console.log({
  outErrorRunStream,
  exitCodes: [
    errorRunStream.processStatus?.code,
    getParentRun(errorRunStream)?.processStatus?.code,
    getParentRun(getParentRun(errorRunStream))?.processStatus
      ?.code,
  ],
});
console.log("-------------------------------------------------------------");

const t = Stream
  .fromRun(`deno eval "console.log('line 1\\nline 2\\n\\nline 3')"`);
const linesReadableStream = t.getLineReadableStream();

const logWritableStream = new WritableStream({
  write(chunk) {
    console.log("<< write", chunk);
  },
  close() {
    console.log("close writableStream", new Date().toISOString());
  },
});
await linesReadableStream.pipeTo(logWritableStream);
await t.wait();
console.log("-------------------------------------------------------------");

await Stream
  .fromArray(["line1", "line2", "line3"])
  .grep("2")
  .log()
  .wait();
console.log("---1----------------------------------------------------------");
await Stream
  .fromRun(`echo -n "line A\nline B\n\nline C`)
  // .run(`deno eval "console.log('line A\\nline B\\n\\nline C')"`)
  .log()
  .wait();
console.log("----2---------------------------------------------------------");

await Stream
  .fromRun(`deno eval "console.log('line A\\nline B\\n\\nline C')"`)
  .grep("line B")
  .log()
  .wait();
console.log("-------------------------------------------------------------");

await Stream
  .fromRun(`deno eval "console.log('line A\\nline B\\n\\nline C')"`)
  .grep("i.*B", { onlyMatching: true })
  .log()
  .wait();
console.log("-------------------------------------------------------------");

await Stream
  .fromRun(`deno eval "console.log('line A\\nline B\\n\\nline C')"`)
  .toFile("tmp/out");
console.log("-------------------------------------------------------------");

sanitize();
//await Stream.toArray(["line1", "line2", "line3"]).grep("2").log().wait();
