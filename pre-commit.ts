#!/usr/bin/env -S deno run -A

import { runPreCommit } from "./examples/pre-commit-parallel.ts";
import {
  dirname,
  fromFileUrl,
} from "https://deno.land/std@0.158.0/path/mod.ts";
import { setCwd } from "./Stream.ts";

setCwd(dirname(fromFileUrl(import.meta.url)));

await runPreCommit([
  { cmd: `deno fmt --check --ignore=vendor,npm,tmp,tmp.ts` },
  { cmd: `deno lint --ignore=vendor,npm,tmp,tmp.ts` },
  { cmd: `deno test -A --ignore=vendor,npm,tmp,tmp.ts` },
], { checkGitDiff: Deno.env.get("CHECK_GIT_DIFF") !== "false" });
