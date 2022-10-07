import { assertEquals, bgGreen } from "../test_deps.ts";
import { Stream } from "../Stream.ts";
import { bgBlue } from "../test_deps.ts";
import { black } from "../deps.ts";

Deno.test("LineStream toArray", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const lineStream = Stream.fromArray(inputArray);
  assertEquals(lineStream.linesStream?.locked, false);
  await lineStream.log().wait();
  assertEquals(lineStream.linesStream?.locked, false);
});

Deno.test("LineStream toArray", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const lineStream = Stream.fromArray(inputArray);
  assertEquals(lineStream.linesStream?.locked, false);
  const array = await lineStream.toArray();
  assertEquals(array, inputArray);
  assertEquals(lineStream.linesStream?.locked, false);
});

Deno.test("LineStream string", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const lineStream = Stream.fromArray(inputArray);
  assertEquals(lineStream.linesStream?.locked, false);
  assertEquals(lineStream.linesStream?.locked, false);
  const str = await lineStream.toString();
  assertEquals(str, inputArray.join("\n"));
  assertEquals(lineStream.linesStream?.locked, false);
});

Deno.test("LineStream grep", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const lineStream = Stream.fromArray(inputArray);
  assertEquals(lineStream.linesStream?.locked, false);
  const grepStream = lineStream.grep("2");
  const array = await grepStream.toArray();
  assertEquals(array, ["line2"]);
  assertEquals(lineStream.linesStream?.locked, false);
  assertEquals(grepStream.linesStream!.locked, false);
});

Deno.test("LineStream grepo", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const lineStream = Stream.fromArray(inputArray);
  assertEquals(lineStream.linesStream?.locked, false);
  const grepStream = lineStream.grepo(".2");
  const array = await grepStream.toArray();
  assertEquals(array, ["e2"]);
  assertEquals(lineStream.linesStream?.locked, false);
  assertEquals(grepStream.linesStream!.locked, false);
});

Deno.test("LineStream grep regex", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const lineStream = Stream.fromArray(inputArray);
  assertEquals(lineStream.linesStream?.locked, false);
  const grepStream = lineStream.grep(/2$/);
  const array = await grepStream.toArray();
  assertEquals(array, ["line2"]);
  assertEquals(lineStream.linesStream?.locked, false);
  assertEquals(grepStream.linesStream!.locked, false);
});

Deno.test("LineStream map", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const lineStream = Stream.fromArray(inputArray);
  assertEquals(lineStream.linesStream?.locked, false);
  const mapStream = lineStream.map((str) => "++" + str);
  const array = await mapStream.toArray();
  assertEquals(array, ["++line1", "++line2", "++line3"]);
  assertEquals(lineStream.linesStream?.locked, false);
  assertEquals(mapStream.linesStream!.locked, false);
});

Deno.test("Stream.logJson().log().logWithTimestamp()", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const out = await Stream
    .fromArray(inputArray)
    .logJson()
    .log()
    .logWithTimestamp()
    .logWithTimestamp(bgBlue)
    .toArray();
  assertEquals(out, ["line1", "line2", "line3"]);
});

Deno.test("Stream.toFile", async () => {
  const tmpPath = await Deno.makeTempFile();
  try {
    const inputArray = ["line1", "line2", "line3"];
    await Stream.fromArray(inputArray).toFile(tmpPath);
    const out = await Deno.readTextFile(tmpPath);
    assertEquals(out, "line1\nline2\nline3");
  } finally {
    await Deno.remove(tmpPath);
  }
});

Deno.test("Stream.toFile from same file", async () => {
  Stream.setVerbose(true);
  const tmpPath = await Deno.makeTempFile();
  await Deno.writeTextFile(tmpPath, "line1\nline2\nline3");
  try {
    await Stream.fromFile(tmpPath).replaceAll("line", "test").toFile(tmpPath);
    const out = await Deno.readTextFile(tmpPath);
    assertEquals(out, "test1\ntest2\ntest3");
  } finally {
    await Deno.remove(tmpPath);
  }
});

Deno.test("Stream.toFile from same file openFile", async () => {
  Stream.setVerbose(true);
  const tmpPath = await Deno.makeTempFile();
  await Deno.writeTextFile(tmpPath, "line1\nline2\nline3");
  try {
    const fsFile = await Deno.open(tmpPath, { read: true, write: true });
    await Stream.fromFile(tmpPath).replaceAll("line", "test").toFile(fsFile);
    const out = await Deno.readTextFile(tmpPath);
    assertEquals(out, "test1\ntest2\ntest3");
  } finally {
    await Deno.remove(tmpPath);
  }
});

Deno.test("Stream.toFile opened", async () => {
  const tmpPath = await Deno.makeTempFile();
  try {
    const inputArray = ["line1", "line2", "line3"];
    const file = await Deno.create(tmpPath);
    await Stream.fromArray(inputArray).toFile(file);
    const out = await Deno.readTextFile(tmpPath);
    assertEquals(out, "line1\nline2\nline3");
  } finally {
    await Deno.remove(tmpPath);
  }
});

Deno.test("Stream.toBytes", async () => {
  Stream.setVerbose(true);
  const file = await Deno.open("test-data/file-1", { read: true });
  const out = await Stream.fromFile(file).toBytes();
  assertEquals(out, new Uint8Array([116, 101, 115, 116, 49, 10]));
});

Deno.test("Stream.toString", async () => {
  const file = await Deno.open("test-data/file-1", { read: true });
  const out = await Stream.fromFile(file).toString();
  assertEquals(out, "test1\n");
});
Deno.test("Stream.toFile", async () => {
  const tmpPath = await Deno.makeTempFile();
  try {
    await Stream.fromFile("test-data/file-1").toFile(tmpPath);
    const out = await Deno.readTextFile(tmpPath);
    assertEquals(out, "test1\n");
  } finally {
    await Deno.remove(tmpPath);
  }
});
Deno.test("Stream.toFile", async () => {
  const tmpPath = await Deno.makeTempFile();
  try {
    const file = await Deno.createSync(tmpPath);
    await Stream.fromFile("test-data/file-1").toFile(file);
    const out = await Deno.readTextFile(tmpPath);
    assertEquals(out, "test1\n");
  } finally {
    await Deno.remove(tmpPath);
  }
});

Deno.test("Stream.cut", async () => {
  const inputArray = ["li,ne,1", "l,ine,2", "line,3"];
  const out = await Stream.fromArray(inputArray).cut(",", [0, 2]).toArray();
  assertEquals(out, [["li", "1"], ["l", "2"], ["line", undefined]]);
});

Deno.test("Stream.replace", async () => {
  const inputArray = ["line1", "line2line", "line3"];
  const out = await Stream.fromArray(inputArray)
    .replace("line", "test")
    .toArray();
  assertEquals(out, ["test1", "test2line", "test3"]);
});

Deno.test("Stream.replaceAll", async () => {
  const inputArray = ["line1", "line2line", "line3"];
  const out = await Stream.fromArray(inputArray)
    .replaceAll("line", "test")
    .toArray();
  assertEquals(out, ["test1", "test2test", "test3"]);
});

Deno.test("Stream.tee", async () => {
  const tmpPath = await Deno.makeTempFile();
  try {
    const inputArray = ["line1", "line2", "line3"];
    const out = await Stream.fromArray(inputArray).tee(tmpPath).toArray();
    assertEquals(out, ["line1", "line2", "line3"]);
    const out2 = await Deno.readTextFile(tmpPath);
    assertEquals(out2, "line1\nline2\nline3");
  } finally {
    await Deno.remove(tmpPath);
  }
});

Deno.test("Stream.tee", async () => {
  const tmpPath = await Deno.makeTempFile();
  try {
    const out = await Stream
      .fromFile("test-data/file-1")
      .tee(tmpPath)
      .toString();
    assertEquals(out, "test1\n");
    const out2 = await Deno.readTextFile(tmpPath);
    assertEquals(out2, "test1\n");
  } finally {
    await Deno.remove(tmpPath);
  }
});

Deno.test("Stream.head", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const out = await Stream.fromArray(inputArray).head(2).toArray();
  assertEquals(out, ["line1", "line2"]);
});

Deno.test("Stream.tail", async () => {
  const inputArray = ["line1", "line2", "line3", "line4", ""];
  const out = await Stream.fromArray(inputArray).tail(2).toArray();
  assertEquals(out, ["line3", "line4"]);
});
Deno.test("Stream.tail shift", async () => {
  const inputArray = ["line1", "line2", "line3", "line4"];
  const out = await Stream.fromArray(inputArray).tail(2).toArray();
  assertEquals(out, ["line3", "line4"]);
});

Deno.test("Stream.sponge", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const out = await Stream.fromArray(inputArray).sponge().toArray();
  assertEquals(out, inputArray);
});

Deno.test("Stream.uniq", async () => {
  const inputArray = ["line1", "line2", "line2", "line3"];
  const out = await Stream.fromArray(inputArray).uniq().toArray();
  assertEquals(out, ["line1", "line2", "line3"]);
});

Deno.test("Stream.sort", async () => {
  const inputArray = ["line2", "line1", "line3"];
  const out = await Stream.fromArray(inputArray).sort().toArray();
  assertEquals(out, ["line1", "line2", "line3"]);
});

Deno.test("Stream getParents", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const stream1 = Stream.fromArray(inputArray);
  const stream2 = stream1.replace("line", "LINE=");
  const stream3 = stream2.cut("=", [0, 1]);
  const out = await stream3.toArray();
  const parents = stream3.getParents();
  assertEquals(out, [["LINE", "1"], ["LINE", "2"], ["LINE", "3"]]);
  assertEquals(parents, [stream1, stream2]);
});

Deno.test("Stream.toBytes", async () => {
  const inputArray = ["line1", "line2"];
  const out = await Stream.fromArray(inputArray).toBytes();
  assertEquals(
    out,
    new Uint8Array([108, 105, 110, 101, 49, 10, 108, 105, 110, 101, 50]),
  );
});

Deno.test("xargsN1", async () => {
  const array = await Stream
    .fromArray(["exit 0", "exit 1", "exit 2", "exit 0"])
    .xargsN1("bash -c", { allowFail: true })
    .log((n) =>
      bgBlue(n.processCmd.join(" ") + " = " + n.processStatus?.success)
    )
    .toArray();
  assertEquals(
    array.map((r) => r.processStatus?.code),
    [0, 1, 2, 0],
  );
});

Deno.test("xargsN1P", async () => {
  const array = await Stream
    .fromArray([
      "echo 0 && sleep 0.5 && echo → 0 && exit 0",
      "echo 1 && sleep 0.4 && echo → 1 && exit 1",
      "echo 2 && sleep 0.3 && echo → 2 && exit 2",
      "echo 3 && sleep 0.1 && echo → 3 && exit 3",
    ])
    .log((m) => bgGreen(black(m)))
    .xargsN1P("bash -c", 2, { allowFail: true })
    .log((n) =>
      bgBlue(n.processCmd.join(" ") + " = " + n.processStatus?.success)
    )
    .toArray();
  assertEquals(
    array.map((r) => r.processStatus?.code),
    [1, 0, 3, 2],
  );
});

Deno.test("Stream.fromArray.run", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const out = await Stream
    .fromArray(inputArray)
    .run("cat")
    .grep("line2")
    .toArray();
  assertEquals(out, ["line2"]);
});
Deno.test("Stream.fromArray.run", async () => {
  const inputArray = "line1\nline2\nline3";
  const out = await Stream
    .fromString(inputArray)
    .run("cat")
    .grep("line2")
    .toArray();
  assertEquals(out, ["line2"]);
});

// Deno.test("xargs", async () => {
//   const array = await Stream
//     .fromArray(["echo 2"])
//     .xargs("bash -c")
//     .toString();
//   assertEquals(array, "2");
// });
