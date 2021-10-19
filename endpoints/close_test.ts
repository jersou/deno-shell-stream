import { FromArray } from "../shell_stream.ts";
import { assertEquals } from "../test_deps.ts";
import { CloseRes } from "./close.ts";

Deno.test("close", async () => {
  const res = await FromArray(["1"]).close();
  assertEquals(res, new CloseRes(true, [], ["1"]));
});

Deno.test("close", async () => {
  const res = await FromArray(["1", "2"]).close();
  assertEquals(res, new CloseRes(true, [], ["1", "2"]));
  assertEquals(res.tostring(), "1\n2");
});
