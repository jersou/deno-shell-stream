#!/usr/bin/env -S deno run -A

import { Stream } from "./Stream.ts";
import { sanitize } from "./utils/sanitize.ts";

const outStr = await Stream
  .run(`deno eval "console.log('is ok - outputString')"`)
  .outputString();
console.log({ outStr });
console.log("-------------------------------------------------------------");

const status = await Stream
  .run(`deno eval "console.log('is ok - wait')"`)
  .wait();
console.log({ status });
console.log("-------------------------------------------------------------");

const runStream = Stream
  .run("echo toto")
  .run("sed 's|o|a|g'")
  .run("sed 's|a|ii|g'");
const outRunStream = await runStream.outputString();
console.log({
  outRunStream,
  exitCodes: [
    runStream.running?.processStatus?.code,
    runStream.parentRunStream?.running?.processStatus?.code,
    runStream.parentRunStream?.parentRunStream?.running?.processStatus?.code,
  ],
});
console.log("-------------------------------------------------------------");

const errorRunStream = Stream
  .run("echo toto")
  .run(["bash", "-c", "exit 12"], {
    dontThrowIfStdinError: true,
    dontThrowIfRunFail: true,
  })
  .run("echo titi");
const outErrorRunStream = await errorRunStream.outputString();
console.log({
  outErrorRunStream,
  exitCodes: [
    errorRunStream.running?.processStatus?.code,
    errorRunStream.parentRunStream?.running?.processStatus?.code,
    errorRunStream.parentRunStream?.parentRunStream?.running?.processStatus
      ?.code,
  ],
});
console.log("-------------------------------------------------------------");

const t = Stream
  .run(`deno eval "console.log('line 1\\nline 2\\n\\nline 3')"`);
const linesReadableStream = t.stdoutLines();

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
  .array(["line1", "line2", "line3"])
  .grep("2")
  .log()
  .wait();
console.log("---1----------------------------------------------------------");
await Stream
  .run(`echo -n "line A\nline B\n\nline C`)
  // .run(`deno eval "console.log('line A\\nline B\\n\\nline C')"`)
  .log()
  .wait();
console.log("----2---------------------------------------------------------");

await Stream
  .run(`deno eval "console.log('line A\\nline B\\n\\nline C')"`)
  .grep("line B")
  .log()
  .wait();
console.log("-------------------------------------------------------------");

await Stream
  .run(`deno eval "console.log('line A\\nline B\\n\\nline C')"`)
  .grep("i.*B", { onlyMatching: true })
  .log()
  .wait();
console.log("-------------------------------------------------------------");

sanitize();
//await Stream.array(["line1", "line2", "line3"]).grep("2").log().wait();
