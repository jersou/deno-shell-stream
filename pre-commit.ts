#!/usr/bin/env -S deno run -A

import { runPreCommit } from "./examples/pre-commit-parallel.ts";
import {
  dirname,
  fromFileUrl,
} from "https://deno.land/std@0.130.0/path/mod.ts";
import { setCwd } from "./Stream.ts";

setCwd(dirname(fromFileUrl(import.meta.url)));

await runPreCommit([
  { cmd: `deno fmt --check --ignore="vendor,npm"`, useStderr: true },
  { cmd: `deno lint --ignore="vendor,npm"`, useStderr: true },
  { cmd: `deno test -A --ignore="vendor,npm"`, useStderr: false },
], { checkGitDiff: Deno.env.get("CHECK_GIT_DIFF") !== "false" });
