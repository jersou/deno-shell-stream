import * as denoShim from "deno.ns";
import { assertEquals } from "../test_deps.js";
import { FromArray, FromFile } from "../shell_stream.js";

denoShim.Deno.test("sponge", async () => {
  const tmpPath = await denoShim.Deno.makeTempFile();
  await FromArray(["line1", "line2", "line3", "line4"]).toFile(tmpPath);
  await FromFile(tmpPath, { closeBeforeStreaming: true })
    .map((line) => "mod-> " + line)
    .sponge()
    .tee(tmpPath)
    .close();
  const res = await FromFile(tmpPath).toArray();
  await denoShim.Deno.remove(tmpPath);
  assertEquals(res, [
    "mod-> line1",
    "mod-> line2",
    "mod-> line3",
    "mod-> line4",
  ]);
});
