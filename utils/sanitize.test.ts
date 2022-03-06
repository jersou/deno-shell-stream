import { assertEquals, delay } from "../test_deps.ts";
import { sanitize } from "./sanitize.ts";

Deno.test({
  name: "sanitize noOpenedRessource",
  async fn() {
    assertEquals(sanitize(), true);
    const filepath = await Deno.makeTempFile();
    const file = await Deno.open(filepath);
    assertEquals(sanitize(), false);
    file.close();
    assertEquals(sanitize(), true);
  },
});

Deno.test({
  name: "sanitize noOpsInProgress",
  async fn() {
    assertEquals(sanitize(), true);
    const delayedPromise = delay(100);
    assertEquals(sanitize(), false);
    await delayedPromise;
    assertEquals(sanitize(), true);
  },
});
