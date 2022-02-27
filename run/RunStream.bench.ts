import { Stream } from "../Stream.ts";
import {
  assertEquals,
  bench,
  BenchmarkRunResult,
  FromRun,
  runBenchmarks,
} from "../test_deps.ts";
import { sanitize } from "../utils/sanitize.ts";

//            ┌────────────────────────┬───────┬──────────┐
//            │       1 000 lines      │    ms │ relative │
//            ├────────────────────────┼───────┼──────────┤
//            │ bash grep              │     5 │        1 │
//            │ Stream V1 run(grep)    │    27 │     5.97 │
//            │ Stream V1 grep()       │    12 │      2.6 │
//            │ Stream V2 run(grep)    │     6 │     1.32 │
//            │ Stream V2 grep()       │    10 │     2.21 │
//            └────────────────────────┴───────┴──────────┘
//            ┌────────────────────────┬───────┬──────────┐
//            │      10 000 lines      │    ms │ relative │
//            ├────────────────────────┼───────┼──────────┤
//            │ bash grep              │     5 │        1 │
//            │ Stream V1 run(grep)    │    26 │     5.31 │
//            │ Stream V1 grep()       │    15 │     3.11 │
//            │ Stream V2 run(grep)    │     7 │     1.46 │
//            │ Stream V2 grep()       │    32 │     6.59 │
//            └────────────────────────┴───────┴──────────┘
//            ┌────────────────────────┬───────┬──────────┐
//            │      100 000 lines     │    ms │ relative │
//            ├────────────────────────┼───────┼──────────┤
//            │ bash grep              │     8 │        1 │
//            │ Stream V1 run(grep)    │  1082 │   141.56 │
//            │ Stream V1 grep()       │   363 │    47.48 │
//            │ Stream V2 run(grep)    │    11 │     1.42 │
//            │ Stream V2 grep()       │   166 │    21.68 │
//            └────────────────────────┴───────┴──────────┘
//            ┌────────────────────────┬───────┬──────────┐
//            │    1 000 000 lines     │    ms │ relative │
//            ├────────────────────────┼───────┼──────────┤
//            │ bash grep              │    20 │        1 │
//            │ Stream V1 run(grep)    │ 10479 │   518.36 │
//            │ Stream V1 grep()       │  3585 │   177.33 │
//            │ Stream V2 run(grep)    │    33 │     1.61 │
//            │ Stream V2 grep()       │  1229 │    60.81 │
//            └────────────────────────┴───────┴──────────┘
const assertData = [
  { inputLinesLength: 1_000, expectedLineLength: 19 },
  { inputLinesLength: 10_000, expectedLineLength: 280 },
  { inputLinesLength: 100_000, expectedLineLength: 3691 },
  { inputLinesLength: 1_000_000, expectedLineLength: 45739 },
];
const dataIndex = 1;
const linesLength = assertData[dataIndex].inputLinesLength;
const expectedLineLength = assertData[dataIndex].expectedLineLength;

const grepStr = "55";
const bashSeqCmd = `seq ${linesLength} ${linesLength * 2}`;

bench({
  name: `bash grep ${linesLength} lines`,
  runs: 10,
  async func(b) {
    b.start();
    const out = await Stream.run([
      "bash",
      "-c",
      `${bashSeqCmd} | grep "${grepStr}"`,
    ]).outputBytes();
    const lines = new TextDecoder().decode(out).split("\n");
    const lineLength = lines.length - 1;
    b.stop();
    assertEquals(lineLength, expectedLineLength);
    assertEquals(sanitize(false), true);
  },
});

bench({
  name: `Stream V1 run(grep) ${linesLength} lines`,
  runs: 2,
  async func(b) {
    b.start();
    const lines = await FromRun(["bash", "-c", bashSeqCmd]).run(
      `grep "${grepStr}"`,
    ).toArray();
    const lineLength = lines.length;
    b.stop();
    //  assertEquals(lineLength, expectedLineLength); // FAIL !
    assertEquals(sanitize(false), true);
  },
});

bench({
  name: `Stream V1 grep() ${linesLength} lines`,
  runs: 4,
  async func(b) {
    b.start();
    const lines = await FromRun(["bash", "-c", bashSeqCmd]).grep(grepStr)
      .toArray();
    const lineLength = lines.length;
    b.stop();
    //  assertEquals(lineLength, expectedLineLength); // FAIL !
    assertEquals(sanitize(false), true);
  },
});

bench({
  name: `Stream V2 run(grep) ${linesLength} lines`,
  runs: 10,
  async func(b) {
    b.start();
    const out = await Stream.run(["bash", "-c", bashSeqCmd]).run(
      `grep "${grepStr}"`,
    )
      .outputBytes();
    const lines = new TextDecoder().decode(out).split("\n");
    b.stop();
    const lineLength = lines.length - 1;
    assertEquals(lineLength, expectedLineLength);
    assertEquals(sanitize(false), true);
  },
});

bench({
  name: `Stream V2 grep() ${linesLength} lines`,
  runs: 4,
  async func(b) {
    b.start();
    const lines = await Stream.run(["bash", "-c", bashSeqCmd]).grep(grepStr)
      .array();
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
