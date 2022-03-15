#!/usr/bin/env -S deno run -A

import { runPreCommit } from "./examples/pre-commit-parallel.ts";
import {
  fromFileUrl,
  normalize,
} from "https://deno.land/std@0.128.0/path/mod.ts";

await runPreCommit([
  { cmd: `deno fmt --check --ignore="vendor,npm"`, useStderr: true },
  { cmd: `deno lint --ignore="vendor,npm"`, useStderr: true },
  { cmd: `deno test -A --ignore="vendor,npm"`, useStderr: false },
], normalize(fromFileUrl(import.meta.url) + "/.."));
