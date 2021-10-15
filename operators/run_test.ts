import { parseCmdString } from "./run.ts";
import { assert, assertEquals } from "../test_deps.ts";
import { FromArray, FromRun } from "../shell_stream.ts";

Deno.test("parseCmdString", () => {
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

Deno.test("run", async () => {
  const denoSh = `
import { copy } from "https://deno.land/std@0.110.0/io/util.ts";
await copy(Deno.stdin, Deno.stdout);`;
  const out = await FromArray(["line1"])
    .run([Deno.execPath(), "eval", denoSh])
    .toString();
  assertEquals(out, "line1");
});

Deno.test("run-stdout", async () => {
  const denoSh = `console.log('line2');`;
  const out = await FromArray(["line1"])
    .run([Deno.execPath(), "eval", denoSh])
    .toString();
  assertEquals(out, "line2");
});

Deno.test("run-stderr", async () => {
  const denoSh = `console.log('line2');console.error('line3');`;
  const res = await FromArray(["line1"])
    .run([Deno.execPath(), "eval", denoSh], { streamStdErr: true })
    .close();
  assertEquals(res.out[0], "line3");
  assertEquals(res.success, true);
});

Deno.test("run-thrown", async () => {
  const denoSh = `Deno.exit(1)`;
  let thrown = false;
  try {
    await FromRun([Deno.execPath(), "eval", denoSh], {
      throwIfRunFail: true,
    }).toString();
  } catch (_e) {
    thrown = true;
  }
  assert(thrown);
});

Deno.test("run-thrown-false", async () => {
  const denoSh = `Deno.exit(1)`;
  const res = await FromRun([Deno.execPath(), "eval", denoSh], {
    throwIfRunFail: false,
  }).close();
  assertEquals(res.success, false);
});

Deno.test("run-KILL", async () => {
  const res = await FromRun([
    Deno.execPath(),
    "eval",
    "console.log(1);await new Promise(r=>setTimeout(r,100000));Deno.exit(1)",
  ])
    .run([Deno.execPath(), "eval", "console.log(2);Deno.exit(2)"])
    .close({ processes: "KILL" });
  assertEquals(res.statuses[0]?.code, 130);
  assertEquals(res.statuses[1]?.code, 2);
});
