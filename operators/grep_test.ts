import { assertEquals } from "../test_deps.ts";
import { FromArray } from "../shell_stream.ts";

Deno.test("grep", async () => {
  const res = await FromArray(["line1", "line222"]).grep(/22/).toArray();
  assertEquals(res, ["line222"]);
});

Deno.test("grep str", async () => {
  const res = await FromArray(["line1", "line222"]).grep("22").toArray();
  assertEquals(res, ["line222"]);
});

Deno.test("grep only-matching", async () => {
  const res = await FromArray(["line17", "line218", "l1422536"])
    .grep(/[123]+/g, { onlyMatching: true })
    .toArray();
  assertEquals(res, ["1", "21", "1", "22", "3"]);
});

Deno.test("grep str only-matching", async () => {
  const res = await FromArray(["line1", "line222", "l1231224"])
    .grep("22", { onlyMatching: true })
    .toArray();
  assertEquals(res, ["22", "22"]);
});
