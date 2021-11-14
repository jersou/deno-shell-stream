import * as denoShim from "deno.ns";
import { parseCmdString } from "./run.js";
import { assert, assertEquals } from "../test_deps.js";
import { FromArray, FromRun } from "../shell_stream.js";

denoShim.Deno.test("parseCmdString", () => {
  assertEquals(parseCmdString("echo aa bb"), ["echo", "aa", "bb"]);
  assertEquals(parseCmdString(`echo 'aa bb' "cc dd"`), [
    "echo",
    "aa bb",
    "cc dd",
  ]);
  assertEquals(parseCmdString("echo 'aa \"c c\" bb'"), ["echo", 'aa "c c" bb']);
  assertEquals(parseCmdString(`echo "'aa'"`), ["echo", "'aa'"]);
  assertEquals(parseCmdString(`echo '"aa"'`), ["echo", '"aa"']);
  assertEquals(parseCmdString(`echo "''"`), ["echo", "''"]);
  assertEquals(parseCmdString(`echo '""'`), ["echo", '""']);
});

denoShim.Deno.test("run", async () => {
  const denoSh = `
import { copy } from "https://deno.land/std@0.114.0/io/util.ts";
await copy(Deno.stdin, Deno.stdout);`;
  const out = await FromArray(["line1"])
    .run([denoShim.Deno.execPath(), "eval", denoSh])
    .toString();
  assertEquals(out, "line1");
});

denoShim.Deno.test("run-stdout", async () => {
  const denoSh = `console.log('line2');`;
  const out = await FromArray(["line1"])
    .run([denoShim.Deno.execPath(), "eval", denoSh])
    .toString();
  assertEquals(out, "line2");
});

denoShim.Deno.test("run-stderr", async () => {
  const denoSh = `console.log('line2');console.error('line3');`;
  const res = await FromArray(["line1"])
    .run([denoShim.Deno.execPath(), "eval", denoSh], { streamStdErr: true })
    .close();
  assertEquals(res.out[0], "line3");
  assertEquals(res.success, true);
});

denoShim.Deno.test("run-thrown", async () => {
  const denoSh = `Deno.exit(1)`;
  let thrown = false;
  try {
    await FromRun([denoShim.Deno.execPath(), "eval", denoSh], {
      throwIfRunFail: true,
    }).toString();
  } catch (_e) {
    thrown = true;
  }
  assert(thrown);
});

denoShim.Deno.test("run-thrown-false", async () => {
  const denoSh = `Deno.exit(1)`;
  const res = await FromRun([denoShim.Deno.execPath(), "eval", denoSh], {
    throwIfRunFail: false,
  }).close();
  assertEquals(res.success, false);
});

denoShim.Deno.test("run-KILL", async () => {
  const res = await FromRun([
    denoShim.Deno.execPath(),
    "eval",
    "console.log(1);await new Promise(r=>setTimeout(r,100000));Deno.exit(1)",
  ])
    .run([denoShim.Deno.execPath(), "eval", "console.log(2);Deno.exit(2)"])
    .close({ processes: "KILL" });
  assertEquals(res.statuses[0]?.code, 130);
  assertEquals(res.statuses[1]?.code, 2);
});

denoShim.Deno.test("run-out", async () => {
  const res = await FromRun([
    denoShim.Deno.execPath(),
    "eval",
    "console.log('aa');console.log('bb');",
  ]).close();
  assert(res.success);
  assertEquals(res.out, ["aa", "bb"]);
});

denoShim.Deno.test("run-single-line", async () => {
  const res = await FromRun([
    denoShim.Deno.execPath(),
    "eval",
    "console.log('aa')",
  ]).close();
  assert(res.success);
  assertEquals(res.out, ["aa"]);
});

denoShim.Deno.test("run-long-line", async () => {
  const length = 5000;
  const longLine = "x".repeat(length);

  const res = await FromRun([
    denoShim.Deno.execPath(),
    "eval",
    `console.log('x'.repeat(${length}))`,
  ]).close();
  assert(res.success);
  assertEquals(res.out, [longLine]);
});

denoShim.Deno.test("run-env", async () => {
  const denoSh = `console.log('aaa='+Deno.env.get('aaa'))`;
  const out = await FromRun([denoShim.Deno.execPath(), "eval", denoSh], {
    env: { aaa: "bbb" },
  }).toString();
  assertEquals(out, "aaa=bbb");
});
