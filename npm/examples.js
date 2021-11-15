const {
  FromArray,
  FromFile,
  FromRun,
  Pipe,
  fromArray,
  filter,
  run,
  log,
} = require("./npm/umd/mod.js");

const {
  bgBlue,
  bgGreen,
  bgRed,
} = require("./npm/umd/deps/deno_land_std_0_114_0/fmt/colors.js");

(async function () {
  console.log(
    bgRed("-FromRun-run-head---------------------------------------"),
  );

  let res = await FromRun("node -h").head(1).toString();
  console.log(res); // → Usage: node [options] [ script.js ] [arguments]

  console.log(
    bgRed("-FromRun-run-tail---------------------------------------"),
  );

  console.log(await FromRun(["node", "-h"]).tail(2).toArray());
  // → [ '', 'Documentation can be found at https://nodejs.org/' ]

  console.log(
    bgRed("-FromRun-run--------------------------------------------"),
  );

  res = await FromRun("cat /etc/passwd").run("grep /root").toString();
  console.log(res); // → root:x:0:0:root:/root:/bin/bash

  console.log(
    bgRed("-FromFile-log-grep-log----------------------------------"),
  );

  // the same example without run cat & grep :
  res = await FromFile("/etc/passwd")
    .log(bgBlue) // → log the entire file with blue background
    .grep(/\/root/) // keep line that contain /root
    .log() // → log "root:x:0:0:root:/root:/bin/bash"
    .toString();
  console.log({ res }); // → res = "root:x:0:0:root:/root:/bin/bash"

  console.log(
    bgRed("-FromRun-run-toFile-------------------------------------"),
  );

  await FromRun("uname -a").run("cut -d' ' -f1").toFile("/tmp/out.txt");
  // /tmp/out.txt contains "Linux" (if os is Linux of course) :
  console.log(await FromFile("/tmp/out.txt").toString());

  console.log(
    bgRed("-FromRun-log-timestamp-log------------------------------"),
  );

  await FromRun(["bash", "-c", "echo 1;sleep 0.4;echo 2"])
    .log() // log "1" and "2"
    .timestamp() // add date/time at the beginning of line
    .log(bgGreen) // log "2021-10-10T20:26:34.986Z 1" and "2021-10-10T20:26:35.388Z 2"
    .close();

  console.log(
    bgRed("-FromRun-log-logWithTimestamp-log-----------------------"),
  );

  await FromRun(["bash", "-c", "echo 1;sleep 0.4;echo 2"])
    .log(bgBlue) // log "1" and "2" with blue background
    .logWithTimestamp() // log "2021-10-10T20:26:34.986Z 1" and "2021-10-10T20:26:35.388Z 2"
    .log(bgGreen) // log "1" and "2" with green background
    .close();

  console.log(
    bgRed("-FromArray-filter-run-log-------------------------------"),
  );

  let closeRes = await FromArray(["1", "2", "3"])
    .filter((l) => parseInt(l) > 1) // keep ["2", "3"]
    .log(bgBlue) // log "2" and "3" with blue background
    .run("wc -l") // "wc -l" count input lines
    .log() // log "2"
    .close();

  console.log(
    bgRed("-Pipe-fromArray-filter-run-log-----pipe API version-----"),
  );
  // The "pipe" API version :
  closeRes = await Pipe(
    fromArray(["1", "2", "3"]),
    filter((l) => parseInt(l) > 1), // keep ["2", "3"],
    run("wc -l"), // "wc -l" count input lines
    log(), // log "2"
  ).close(); // close the stream and return "2" in "out" property
  console.log({ closeRes });
  // closeRes: CloseRes {
  //   success: true,
  //     statuses: [ undefined, [Object], undefined ],
  //     out: [ '2' ]
  // }

  console.log(
    bgRed("-FromArray-filter-pipe-run-log--------------------------"),
  );

  await FromArray(["1", "2", "3"])
    .filter((l) => parseInt(l) > 1) // keep ["2", "3"]
    .pipe(
      run("wc -l"), // "wc -l" count input lines
      log(), // log "2"
    )
    .close();

  console.log(
    bgRed("-FromArray-tee-replace-tap-map-log----------------------"),
  );

  await FromArray(["--foo--"])
    .tee("/tmp/out1.txt") // write to file, keep the stream unchanged
    .replace("foo", "bar") // like sed : "--foo--" → "--bar--"
    .tap((l) => console.error(`Err ${l}`)) // tap keep the stream unchanged
    .map((line) => ">>> " + line) // map transform the stream "--bar--" → ">>> --bar--"
    .log(bgBlue) // log ">>> --bar--" with blue background
    .close();

  console.log(
    bgRed("-FromRun-run-run-----------------------------------------"),
  );
  // exit codes of processes can be retrieved :
  closeRes = await FromRun([
    "node",
    "-e",
    'console.log("foo"); process.exit(13)',
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
})();
