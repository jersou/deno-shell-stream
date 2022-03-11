#!/usr/bin/env -S deno run -A
import {
  getRunStream,
  run,
  runToString,
  Stream,
} from "https://deno.land/x/shell_stream@v1.0.10/mod.ts";
import { bgBlue } from "https://deno.land/std@0.128.0/fmt/colors.ts";

let rootLine = await Stream
  .fromRun("cat /etc/passwd")
  .run("grep /root")
  .toString();
console.log(rootLine); // → root:x:0:0:root:/root:/bin/bash

console.log(await runToString("uname --kernel-name")); // → Linux

// the same example without run cat & grep command :
rootLine = await Stream.fromFile("/etc/passwd")
  .log(bgBlue) // → log the entire file with blue background
  .grep(/\/root/) // keep lines that contain /root
  .log() // → log "root:x:0:0:root:/root:/bin/bash"
  .toString();
console.log({ rootLine });
// → { rootLine: "root:x:0:0:root:/root:/bin/bash" }

const denoVersionFromCli = await Stream
  .fromRun(["deno", "--version"])
  .head(1)
  .toString();
console.log({ denoVersionFromCli });
// → { denoVersionFromCli: "deno 1.19.2 (release, x86_64-unknown-linux-gnu)" }

console.log(await run("deno --version").tail(2).toArray());
// → [ "v8 9.9.115.7", "typescript 4.5.2" ]

// exit codes of processes can be retrieved :
const stream = await Stream.fromArray(["line1", "line2"])
  .run(
    [Deno.execPath(), "eval", 'console.log("foo"); Deno.exit(13)'],
    { allowFail: true },
  )
  .logWithTimestamp()
  .replace("foo", "bar")
  .run("cat")
  .logWithTimestamp(bgBlue)
  .wait();
const exitCodes = stream
  .getParents()
  .map(getRunStream)
  .map((s) => s?.processStatus?.code);
console.log({ exitCodes });
// → { exitCodes: [ undefined, 13, undefined, undefined, 0 ] }
