import { assertEquals } from "../test_deps.ts";
import { FromArray, FromFile } from "../shell_stream.ts";

Deno.test("sponge", async () => {
  const tmpPath = await Deno.makeTempFile();
  await FromArray(["line1", "line2", "line3", "line4"]).toFile(tmpPath);
  await FromFile(tmpPath, { closeBeforeStream: true })
    .map((line) => "mod-> " + line)
    .sponge()
    .tee(tmpPath)
    .close();
  const res = await FromFile(tmpPath).toArray();
  await Deno.remove(tmpPath);
  assertEquals(res, [
    "mod-> line1",
    "mod-> line2",
    "mod-> line3",
    "mod-> line4",
  ]);
});
