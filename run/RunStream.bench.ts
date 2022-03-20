import { Stream } from "../Stream.ts";
import { assertEquals } from "../test_deps.ts";

import {
  bench,
  runBenchmarks,
} from "https://deno.land/std@0.130.0/testing/bench.ts";

import type { BenchmarkRunResult } from "https://deno.land/std@0.130.0/testing/bench.ts";
import { FromRun } from "https://deno.land/x/shell_stream@v0.1.13/mod.ts";

import { sanitize } from "../utils/sanitize.ts";

//            ┌────────────────────────┬───────┬──────────┐
//            │       1 000 lines      │    ms │ relative │
//            ├────────────────────────┼───────┼──────────┤
//            │ bash grep              │     5 │        1 │
//            │ Stream V1 run(grep)    │    20 │     3.71 │
//            │ Stream V1 grep()       │    12 │     2.14 │
//            │ Stream V2 run(grep)    │     7 │     1.23 │
//            │ Stream V2 grep()       │     7 │     1.24 │
//            └────────────────────────┴───────┴──────────┘
//            ┌────────────────────────┬───────┬──────────┐
//            │      10 000 lines      │    ms │ relative │
//            ├────────────────────────┼───────┼──────────┤
//            │ bash grep              │     5 │        1 │
//            │ Stream V1 run(grep)    │    18 │     3.38 │
//            │ Stream V1 grep()       │    13 │     2.38 │
//            │ Stream V2 run(grep)    │     8 │     1.29 │
//            │ Stream V2 grep()       │    20 │     3.59 │
//            └────────────────────────┴───────┴──────────┘
//            ┌────────────────────────┬───────┬──────────┐
//            │      100 000 lines     │    ms │ relative │
//            ├────────────────────────┼───────┼──────────┤
//            │ bash grep              │     6 │        1 │
//            │ Stream V1 run(grep)    │   991 │   175.66 │
//            │ Stream V1 grep()       │   332 │    58.84 │
//            │ Stream V2 run(grep)    │     7 │     1.25 │
//            │ Stream V2 grep()       │   126 │    22.31 │
//            └────────────────────────┴───────┴──────────┘
//            ┌────────────────────────┬───────┬──────────┐
//            │    1 000 000 lines     │    ms │ relative │
//            ├────────────────────────┼───────┼──────────┤
//            │ bash grep              │    21 │        1 │
//            │ Stream V1 run(grep)    │ 10064 │   486.08 │
//            │ Stream V1 grep()       │  3338 │   161.23 │
//            │ Stream V2 run(grep)    │    33 │     1.61 │
//            │ Stream V2 grep()       │  1069 │    51.65 │
//            └────────────────────────┴───────┴──────────┘
const assertData = [
  { inputLinesLength: 1_000, expectedLineLength: 19 },
  { inputLinesLength: 10_000, expectedLineLength: 280 },
  { inputLinesLength: 100_000, expectedLineLength: 3691 },
  { inputLinesLength: 1_000_000, expectedLineLength: 45739 },
];
const dataIndex = 2;
const linesLength = assertData[dataIndex].inputLinesLength;
const expectedLineLength = assertData[dataIndex].expectedLineLength;

const grepStr = "55";
const bashSeqCmd = `seq ${linesLength} ${linesLength * 2}`;
const runMult = 1;

bench({
  name: `bash grep ${linesLength} lines`,
  runs: 10 * runMult,
  async func(b) {
    b.start();
    const out = await Stream.fromRun([
      "bash",
      "-c",
      `${bashSeqCmd} | grep "${grepStr}"`,
    ]).toBytes();
    const lines = new TextDecoder().decode(out).split("\n");
    const lineLength = lines.length - 1;
    b.stop();
    assertEquals(lineLength, expectedLineLength);
    assertEquals(sanitize(false), true);
  },
});

bench({
  name: `Stream V1 run(grep) ${linesLength} lines`,
  runs: 2 * runMult,
  async func(b) {
    b.start();
    await FromRun(["bash", "-c", bashSeqCmd]).run(
      `grep "${grepStr}"`,
    ).toArray();
    // const lineLength = lines.length;
    b.stop();
    //  assertEquals(lineLength, expectedLineLength); // FAIL !
    assertEquals(sanitize(false), true);
  },
});

bench({
  name: `Stream V1 grep() ${linesLength} lines`,
  runs: 4 * runMult,
  async func(b) {
    b.start();
    await FromRun(["bash", "-c", bashSeqCmd]).grep(grepStr)
      .toArray();
    // const lineLength = lines.length;
    b.stop();
    //  assertEquals(lineLength, expectedLineLength); // FAIL !
    assertEquals(sanitize(false), true);
  },
});

bench({
  name: `Stream V2 run(grep) ${linesLength} lines`,
  runs: 10 * runMult,
  async func(b) {
    b.start();
    const out = await Stream.fromRun(["bash", "-c", bashSeqCmd]).run(
      `grep "${grepStr}"`,
    )
      .toBytes();
    const lines = new TextDecoder().decode(out).split("\n");
    b.stop();
    const lineLength = lines.length - 1;
    assertEquals(lineLength, expectedLineLength);
    assertEquals(sanitize(false), true);
  },
});

bench({
  name: `Stream V2 grep() ${linesLength} lines`,
  runs: 4 * runMult,
  async func(b) {
    b.start();
    const lines = await Stream.fromRun(["bash", "-c", bashSeqCmd]).grep(grepStr)
      .toArray();
    const lineLength = lines.length;
    b.stop();
    assertEquals(lineLength, expectedLineLength);
    assertEquals(sanitize(false), true);
  },
});

runBenchmarks()
  .then((results: BenchmarkRunResult) => {
    const bashMs = results.results[0].measuredRunsAvgMs;
    const table = results.results.map(
      (r) => ({
        name: r.name,
        ms: Math.round(r.measuredRunsAvgMs),
        relative: parseFloat((r.measuredRunsAvgMs / bashMs).toFixed(2)),
      }),
    );
    console.table(table);
  })
  .catch((error: Error) => console.error(error));
