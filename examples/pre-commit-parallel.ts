/* usage :
 * ```ts
 * import { runPreCommit } from "https://deno.land/x/shell_stream@v1.0.16/examples/pre-commit-parallel.ts";
 * import { fromFileUrl, normalize } from "https://deno.land/std@0.128.0/path/mod.ts";
 * import { setCwd } from "https://deno.land/x/shell_stream@v1.0.16/Stream.ts";
 * setCwd(dirname(fromFileUrl(import.meta.url)));
 * await runPreCommit([
 *   { cmd: `deno fmt --check --ignore="vendor,npm"`, useStderr: true },
 *   { cmd: `deno lint --ignore="vendor,npm"`, useStderr: true },
 *   { cmd: `deno test -A --ignore="vendor,npm"`, useStderr: false },
 * ]);
 * ```
 * The commands are run only if there are staged file in their cwd
 */
import {
  bgBlue,
  bgGreen,
  bgRed,
  black,
} from "https://deno.land/std@0.128.0/fmt/colors.ts";
import {
  run,
  runKo,
  RunOptions,
  RunStream,
  sanitize,
  Stream,
} from "/data/Projets/Logiciels/deno/ShellStreamV2/mod.ts";

import {
  default as ProgressBar,
} from "https://deno.land/x/progress@v1.2.5/mod.ts";

export function onError(streamData: { stream: RunStream; out: string }) {
  const err = (s: string) => console.error(bgRed(black(s)));
  err("");
  err("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
  console.error(streamData.out);
  err("");
  err("                                                                 ");
  err("                                                                 ");
  err("                              ERROR                              ");
  err("                                                                 ");
  err("                                                                 ");
  err("");
  err("Error while : " + streamData.stream.processCmd.join(" "));
  Deno.exit(1);
}

const ok = (s: string) => console.error(bgGreen(black(s)));
const blue = (s: string) => console.error(bgBlue(s));

export function onSuccess() {
  ok("");
  ok("                                                                 ");
  ok("                                                                 ");
  ok("                               OK                                ");
  ok("                                                                 ");
  ok("                                                                 ");
  Deno.exit(0);
}

async function pathHasDiff(path: string) {
  return await runKo(
    `git diff --cached --exit-code -- ${path} `,
    { stderr: "null", stdout: "null" },
  );
}

type RunPreCommitData = {
  cwd?: string;
  diffPath?: string;
  cmd: string[] | string;
  useStderr?: boolean;
};

export async function runPreCommit(
  runData: RunPreCommitData[],
  checkGitDiff = true,
) {
  const runs = [];
  for (const data of runData) {
    if (!checkGitDiff || await pathHasDiff(data.diffPath ?? data.cwd ?? ".")) {
      const optStdOut: RunOptions = {
        allowFail: true,
        stdout: "null",
        cwd: data.cwd,
      };
      const optStdErr: RunOptions = { ...optStdOut, useStderr: true };
      runs.push(run(data.cmd, data.useStderr ? optStdErr : optStdOut));
    }
  }

  Stream.resetProcessCount();
  const progress = new ProgressBar({ title: "progress:", interval: 0 });
  Stream.subscribeProcessEvent(({ processDone }) => {
    progress.render(processDone, { total: runs.length });
  });

  await Stream.fromArray(runs)
    .mapAwaitParallel(async (s) => ({
      stream: s,
      out: await s.log().toString().then((out) => {
        console.error();
        blue(` → ${s.processCmd.join(" ")} From ${s.opt?.cwd ?? ""} OK !`);
        return out;
      }),
    }))
    .filter((streamData) => streamData.stream.processStatus?.success !== true)
    .map((streamData) => onError(streamData))
    .wait();
  onSuccess();
  sanitize();
}
