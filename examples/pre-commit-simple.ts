#!/usr/bin/env -S deno run -A

import { bgRed, dirname, fromFileUrl } from "../test_deps.ts";
import { run, setCwd, Stream, waitRun } from "../Stream.ts";
Stream.setVerbose(true);
setCwd(dirname(fromFileUrl(import.meta.url)));
try {
  await run(`deno fmt --check --ignore="vendor,npm"`);
  await waitRun(`deno lint --ignore="vendor,npm"`);
  await waitRun(`deno test -A --ignore="vendor,npm"`);
} catch (_) {
  console.log(bgRed("                                                 "));
  console.log(bgRed("                                                 "));
  console.log(bgRed("                      ERROR                      "));
  console.log(bgRed("                                                 "));
  console.log(bgRed("                                                 "));
  prompt("");
  Deno.exit(1);
}
