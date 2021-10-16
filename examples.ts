#!/usr/bin/env -S deno run -A

import { FromArray, FromFile, FromRun, Pipe } from "./shell_stream.ts";
import { bgBlue, bgGreen, bgRed, copy } from "./deps.ts";
import { fromArray } from "./startpoints/from_array.ts";
import { filter } from "./operators/filter.ts";
import { run } from "./operators/run.ts";
import { log } from "./operators/log.ts";
import { sanitize } from "./sanitize.ts";

console.log(bgRed("-FromRun-run-head---------------------------------------"));

let res = await FromRun("deno --version").head(1).toString();
console.log(res); // → deno 1.15.1 (release, x86_64-unknown-linux-gnu)

console.log(bgRed("-FromRun-run-tail---------------------------------------"));

console.log(await FromRun(["deno", "--version"]).tail(2).toArray());
// → ["v8 9.5.172.19", "typescript 4.4.2"]

console.log(bgRed("-FromRun-run--------------------------------------------"));

res = await FromRun("cat /etc/passwd").run("grep /root").toString();
console.log(res); // → root:x:0:0:root:/root:/bin/bash

console.log(bgRed("-FromFile-log-grep-log----------------------------------"));

// the same example without run cat & grep :
res = await FromFile("/etc/passwd")
  .log(bgBlue) // → log the entire file with blue background
  .grep(/\/root/) // keep line that contain /root
  .log() // → log "root:x:0:0:root:/root:/bin/bash"
  .toString();
console.log({ res }); // → res = "root:x:0:0:root:/root:/bin/bash"

console.log(bgRed("-FromRun-run-toFile-------------------------------------"));

await FromRun("uname -a").run("cut -d' ' -f1").toFile("/tmp/out.txt");
// /tmp/out.txt contains "Linux" (if os is Linux of course) :
console.log(await FromFile("/tmp/out.txt").toString());

console.log(bgRed("-FromRun-log-timestamp-log------------------------------"));

await FromRun(["bash", "-c", "echo 1;sleep 0.4;echo 2"])
  .log() // log "1" and "2"
  .timestamp() // add date/time at the beginning of line
  .log() // log "2021-10-10T20:26:34.986Z 1" and "2021-10-10T20:26:35.388Z 2"
  .close();

console.log(bgRed("-FromRun-log-logWithTimestamp-log-----------------------"));

await FromRun(["bash", "-c", "echo 1;sleep 0.4;echo 2"])
  .log(bgBlue) // log "1" and "2" with blue background
  .logWithTimestamp() // log "2021-10-10T20:26:34.986Z 1" and "2021-10-10T20:26:35.388Z 2"
  .log(bgGreen) // log "1" and "2" with green background
  .close();

console.log(bgRed("-FromArray-filter-run-log-------------------------------"));

let closeRes = await FromArray(["1", "2", "3"])
  .filter((l) => parseInt(l) > 1) // keep ["2", "3"]
  .log(bgBlue) // log "2" and "3" with blue background
  .run("wc -l") // "wc -l" count input lines
  .log() // log "2"
  .close();

console.log(bgRed("-Pipe-fromArray-filter-run-log-----pipe API version-----"));
// The "pipe" API version :
closeRes = await Pipe(
  fromArray(["1", "2", "3"]),
  filter((l: string) => parseInt(l) > 1), // keep ["2", "3"],
  run("wc -l"), // "wc -l" count input lines
  log(), // log "2"
).close(); // close the stream and return "2" in "out" property
console.log({ closeRes });
// {
//   success: true,
//   statuses: [
//     undefined,
//     { success: true, code: 0, cmd: [ "wc", "-l" ] },
//     undefined
//   ],
//   out: [ "2" ]
// }

console.log(bgRed("-FromArray-filter-pipe-run-log--------------------------"));

await FromArray(["1", "2", "3"])
  .filter((l) => parseInt(l) > 1) // keep ["2", "3"]
  .pipe(
    run("wc -l"), // "wc -l" count input lines
    log(), // log "2"
  )
  .close();

console.log(bgRed("-FromArray-tee-replace-tap-map-log----------------------"));

await FromArray(["--foo--"])
  .tee("/tmp/out1.txt") // write to file, keep the stream unchanged
  .replace("foo", "bar") // like sed : "--foo--" → "--bar--"
  .tap((l) => console.error(`Err ${l}`)) // tap keep the stream unchanged
  .map((line) => ">>> " + line) // map transform the stream "--bar--" → ">>> --bar--"
  .log(bgBlue) // log ">>> --bar--" with blue background
  .close();

console.log(bgRed("-FromRun-grep-is equivalent to--------------------------"));

// await FromRun("cat /etc/passwd").grep(/\/root/).toString();
// is equivalent to :
const process = Deno.run({
  cmd: ["cat", "/etc/passwd"],
  stdout: "piped",
});
res = new TextDecoder()
  .decode(await process.output())
  .split("\n")
  .filter((line) => line.match(/\/root/))
  .join("\n");
process.close();
console.log(res); // → root:x:0:0:root:/root:/bin/bash

console.log(bgRed("-FromRun-run-run-is equivalent to-----------------------"));
// await FromRun("cat /etc/passwd").run('grep /root').toString();
// is equivalent to :
const process1 = Deno.run({ cmd: ["cat", "/etc/passwd"], stdout: "piped" });
const process2 = Deno.run({
  cmd: ["grep", "/root"],
  stdin: "piped",
  stdout: "piped",
});
// copy() get stuck if the process1.stdout is not closed
(async () => {
  await process1.status();
  process1.stdout!.close();
  process1.close();
})();
try {
  await copy(process1.stdout!, process2.stdin!);
} catch (_) {
  // process1.stdout.close() generate BadResource exception in copy()
}
process2.stdin!.close();
res = new TextDecoder().decode(await process2.output());
process2.close();
console.log(res); // → root:x:0:0:root:/root:/bin/bash

console.log(bgRed("-FromRun-run-run-----------------------------------------"));
// exit codes of processes can be retrieved :
closeRes = await FromRun([
  Deno.execPath(),
  "eval",
  'console.log("foo"); Deno.exit(13)',
])
  .run("cat")
  .run("cat")
  .close();
const codes = closeRes.statuses.map((s) => s?.code);
console.log(`success=${closeRes.success} codes=${codes} out=${closeRes.out}`);
// → "success=false codes=13,0,0 out=foo"
// → "success=false; exit codes = 13,0,0"
console.log(closeRes);
// closeRes === {
//   success: false,
//   statuses: [ { success: false, code: 1, cmd: [...] },
//               { success: true, code: 0, cmd: [ "cat" ] } ],
//   out: [ "foo" ]
// }

// check : all ressources are closed and ops completed
sanitize();
