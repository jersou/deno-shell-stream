import { FromArray } from "../shell_stream.ts";
import { assert } from "../test_deps.ts";

Deno.test("timestamp", async () => {
  const out = await FromArray(["line1"]).timestamp().toString();
  assert(
    out.match(
      /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}.*line1/,
    ),
  );
});
