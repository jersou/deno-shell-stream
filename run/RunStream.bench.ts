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
//            │ bash grep              │     8 │        1 │
//            │ Stream V1 run(grep)    │    33 │     4.25 │
//            │ Stream V1 grep()       │    20 │     2.56 │
//            │ Stream V2 run(grep)    │    10 │     1.26 │
//            │ Stream V2 grep()       │     9 │     1.19 │
//            └────────────────────────┴───────┴──────────┘
//            ┌────────────────────────┬───────┬──────────┐
//            │      10 000 lines      │    ms │ relative │
//            ├────────────────────────┼───────┼──────────┤
//            │ bash grep              │     7 │        1 │
//            │ Stream V1 run(grep)    │    30 │      4.2 │
//            │ Stream V1 grep()       │    22 │     2.97 │
//            │ Stream V2 run(grep)    │     9 │     1.19 │
//            │ Stream V2 grep()       │    32 │     4.47 │
//            └────────────────────────┴───────┴──────────┘
//            ┌────────────────────────┬───────┬──────────┐
//            │      100 000 lines     │    ms │ relative │
//            ├────────────────────────┼───────┼──────────┤
//            │ bash grep              │    10 │        1 │
//            │ Stream V1 run(grep)    │  1852 │   179.96 │
//            │ Stream V1 grep()       │   645 │    62.73 │
//            │ Stream V2 run(grep)    │    15 │      1.5 │
//            │ Stream V2 grep()       │   226 │    21.97 │
//            └────────────────────────┴───────┴──────────┘
//            ┌────────────────────────┬───────┬──────────┐
//            │    1 000 000 lines     │    ms │ relative │
//            ├────────────────────────┼───────┼──────────┤
//            │ bash grep              │    32 │        1 │
//            │ Stream V1 run(grep)    │ 19633 │    604.6 │
//            │ Stream V1 grep()       │  6907 │    212.7 │
//            │ Stream V2 run(grep)    │    48 │     1.49 │
//            │ Stream V2 grep()       │  1989 │    61.27 │
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
const runMult = 4;

bench({
  name: `bash grep ${linesLength} lines`,
  runs: 10 * runMult,
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
  runs: 2 * runMult,
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
  runs: 4 * runMult,
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
  runs: 10 * runMult,
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
  runs: 4 * runMult,
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
