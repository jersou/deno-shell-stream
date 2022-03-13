#!/usr/bin/env -S deno run -A
import { bgGreen, bgRed, dirname, fromFileUrl } from "../test_deps.ts";
import { run, setCwd, Stream } from "../Stream.ts";
import { black } from "../deps.ts";
import { RunOptions, RunStream } from "../run/RunStream.ts";

const optStdOut: RunOptions = { allowFail: true, stdout: "null" };
const optStdErr: RunOptions = { ...optStdOut, useStderr: true };

const runs = [
  run(`deno fmt --check --ignore="vendor,npm"`, optStdErr),
  run(`deno lint --ignore="vendor,npm"`, optStdErr),
  run(`deno test -A --ignore="vendor,npm"`, optStdOut),
];
setCwd(dirname(fromFileUrl(import.meta.url)));

function onError(streamData: { stream: RunStream; out: string }) {
  const err = (s: string) => console.error(bgRed(s));
  err("");
  err("Error with the command : " + streamData.stream.processCmd.join(" "));
  console.error(streamData.out);
  err("");
  err("                                                                 ");
  err("                                                                 ");
  err("                              ERROR                              ");
  err("                                                                 ");
  err("                                                                 ");
  Deno.exit(1);
}

await Stream
  .fromArray(runs)
  .mapAwaitParallel(async (s) => ({ stream: s, out: await s.toString() }))
  .filter((streamData) => streamData.stream.processStatus?.success !== true)
  .map((streamData) => onError(streamData))
  .wait();

const ok = (s: string) => console.error(bgGreen(black(s)));
ok("");
ok("                                                                 ");
ok("                                                                 ");
ok("                               OK                                ");
ok("                                                                 ");
ok("                                                                 ");
