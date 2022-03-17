#!/usr/bin/env -S deno run -A

import { run } from "https://deno.land/x/shell_stream@v1.0.19/Stream.ts";
import { emptyDir } from "https://deno.land/std@0.130.0/fs/empty_dir.ts";

await emptyDir(".cov_profile");
await run(`deno test --ignore="vendor,npm" --coverage=.cov_profile -A`).wait();
await run(`deno coverage .cov_profile --lcov`)
  .toFile(".cov_profile/cov_profile.lcov");
await run(`genhtml -o .cov_profile/html .cov_profile/cov_profile.lcov`).wait();
