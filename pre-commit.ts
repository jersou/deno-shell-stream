#!/usr/bin/env -S deno run -A

import { dirname, fromFileUrl } from "./test_deps.ts";
import { setCwd, Stream, waitRun } from "./Stream.ts";
Stream.setVerbose(true);
setCwd(dirname(fromFileUrl(import.meta.url)));
await waitRun(`deno fmt --check --ignore="vendor,npm"`);
await waitRun(`deno lint --ignore="vendor,npm"`);
await waitRun(`deno test -A --ignore="vendor,npm"`);
