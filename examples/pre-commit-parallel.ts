/* usage :
 * ```ts
 * import { runPreCommit } from "https://deno.land/x/shell_stream@v1.0.15/examples/pre-commit-parallel.ts";
 * import { fromFileUrl, normalize } from "https://deno.land/std@0.128.0/path/mod.ts";
 * await runPreCommit([
 *   { cmd: `deno fmt --check --ignore="vendor,npm"`, useStderr: true },
 *   { cmd: `deno lint --ignore="vendor,npm"`, useStderr: true },
 *   { cmd: `deno test -A --ignore="vendor,npm"`, useStderr: false },
 * ], normalize(fromFileUrl(import.meta.url) + "/.."));
 * ```
 */

import {
  run,
  RunStream,
  setCwd,
  Stream,
} from "https://deno.land/x/shell_stream@v1.0.14/mod.ts";
import { RunOptions } from "https://deno.land/x/shell_stream@v1.0.14/run/RunStream.ts";
import { normalize } from "https://deno.land/std@0.128.0/path/mod.ts";
import {
  bgGreen,
  bgRed,
  black,
} from "https://deno.land/std@0.128.0/fmt/colors.ts";

export function onError(streamData: { stream: RunStream; out: string }) {
  const err = (s: string) => console.error(bgRed(s));
  err("");
  console.error(streamData.out);
  err("");
  err("                                                                 ");
  err("                                                                 ");
  err("                              ERROR                              ");
  err("                                                                 ");
  err("                                                                 ");
  err("");
  err("Error with the command : " + streamData.stream.processCmd.join(" "));
  Deno.exit(1);
}
export function onSuccess() {
  const ok = (s: string) => console.error(bgGreen(black(s)));
  ok("");
  ok("                                                                 ");
  ok("                                                                 ");
  ok("                               OK                                ");
  ok("                                                                 ");
  ok("                                                                 ");
  Deno.exit(0);
}
export async function runPreCommit(
  commands: { cmd: string[] | string; useStderr?: boolean }[],
  cwd?: string,
) {
  if (cwd) {
    setCwd(normalize(cwd));
  }

  const optStdOut: RunOptions = { allowFail: true, stdout: "null" };
  const optStdErr: RunOptions = { ...optStdOut, useStderr: true };
  const runs = commands.map((cmdData) =>
    run(cmdData.cmd, cmdData.useStderr ? optStdErr : optStdOut)
  );

  await Stream
    .fromArray(runs)
    .mapAwaitParallel(async (s) => ({ stream: s, out: await s.toString() }))
    .filter((streamData) => streamData.stream.processStatus?.success !== true)
    .map((streamData) => onError(streamData))
    .wait();
  onSuccess();
}
