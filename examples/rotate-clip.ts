#!/usr/bin/env -S deno run -A
/**
 * pick the clipboard table text and rotate 90°:
 * ```ts
 * this input in clipboard
 *          A	B	C
 *          1	2	3
 *          4	5	6
 *          7	8	9
 * is output as :
 *          A	1	4	7
 *          B	2	5	8
 *          C	3	6	9
 * ```
 */
import { Stream } from "https://deno.land/x/shell_stream@v1.0.15/mod.ts";
import {
  bgBrightBlue,
  bgBrightGreen,
} from "https://deno.land/std@0.128.0/fmt/colors.ts";

const array = await Stream
  .fromRun("xsel --clipboard")
  .log(bgBrightBlue)
  .toArray();

const data = array.map((l) => l.split("\t"));
const revData = [];
for (let j = 0; j < data[0].length; j++) {
  const newLine = [];
  for (let i = 0; i < data.length; i++) {
    newLine.push(data[i][j]);
  }
  revData.push(newLine);
}
const out = revData.map((line) => line.join("\t")).join("\n");

await Stream
  .fromString(out)
  .log(bgBrightGreen)
  .run("xsel --clipboard -i")
  .wait();
