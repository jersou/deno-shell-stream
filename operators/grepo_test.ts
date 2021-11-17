import { assertEquals } from "../test_deps.ts";
import { FromArray } from "../shell_stream.ts";

Deno.test("grepo", async () => {
  const res = await FromArray(["line17", "line218", "l1422536"])
    .grepo(/[123]+/g)
    .toArray();
  assertEquals(res, ["1", "21", "1", "22", "3"]);
});

Deno.test("grepo str", async () => {
  const res = await FromArray(["line1", "line222", "l1231224"])
    .grepo("22")
    .toArray();
  assertEquals(res, ["22", "22"]);
});
