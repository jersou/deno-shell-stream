import { arrayToStream } from "../utils/ArrayToStream.ts";
import { assertEquals } from "../test_deps.ts";
import { LineStream } from "./LineStream.ts";

Deno.test("LineStream toArray", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const readableStream = arrayToStream(inputArray);
  const lineStream = new LineStream(undefined, readableStream);
  assertEquals(readableStream.locked, false);
  await lineStream.log().wait();
  assertEquals(readableStream.locked, false);
});

Deno.test("LineStream toArray", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const readableStream = arrayToStream(inputArray);
  const lineStream = new LineStream(undefined, readableStream);
  assertEquals(readableStream.locked, false);
  const array = await lineStream.toArray();
  assertEquals(array, inputArray);
  assertEquals(readableStream.locked, false);
});

Deno.test("LineStream string", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const readableStream = arrayToStream(inputArray);
  const lineStream = new LineStream(undefined, readableStream);
  assertEquals(readableStream.locked, false);
  const str = await lineStream.toString();
  assertEquals(str, inputArray.join("\n"));
  assertEquals(readableStream.locked, false);
});

Deno.test("LineStream grep", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const readableStream = arrayToStream(inputArray);
  const lineStream = new LineStream(undefined, readableStream);
  assertEquals(readableStream.locked, false);
  const array = await lineStream.grep("2").toArray();
  assertEquals(array, ["line2"]);
  assertEquals(readableStream.locked, false);
  assertEquals(lineStream.child!.linesStream!.locked, false);
});

Deno.test("LineStream grepo", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const readableStream = arrayToStream(inputArray);
  const lineStream = new LineStream(undefined, readableStream);
  assertEquals(readableStream.locked, false);
  const array = await lineStream.grepo(".2").toArray();
  assertEquals(array, ["e2"]);
  assertEquals(readableStream.locked, false);
  assertEquals(lineStream.child!.linesStream!.locked, false);
});

Deno.test("LineStream grep regex", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const readableStream = arrayToStream(inputArray);
  const lineStream = new LineStream(undefined, readableStream);
  assertEquals(readableStream.locked, false);
  const array = await lineStream.grep(/2$/).toArray();
  assertEquals(array, ["line2"]);
  assertEquals(readableStream.locked, false);
  assertEquals(lineStream.child!.linesStream!.locked, false);
});

Deno.test("LineStream map", async () => {
  const inputArray = ["line1", "line2", "line3"];
  const readableStream = arrayToStream(inputArray);
  const lineStream = new LineStream(undefined, readableStream);
  assertEquals(readableStream.locked, false);
  const array = await lineStream.map((str) => "++" + str).toArray();
  assertEquals(array, ["++line1", "++line2", "++line3"]);
  assertEquals(readableStream.locked, false);
  assertEquals(lineStream.child!.linesStream!.locked, false);
});
