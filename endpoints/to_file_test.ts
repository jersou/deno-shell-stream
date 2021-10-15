import { FromArray, FromFile } from "../shell_stream.ts";
import { assertEquals } from "../test_deps.ts";

Deno.test("toFile", async () => {
  const path = await Deno.makeTempFile();
  const array = ["line1", "line2"];
  await FromArray(array).toFile(path);
  const res = await FromFile(path).toArray();
  await Deno.remove(path);
  assertEquals(res, array);
});
