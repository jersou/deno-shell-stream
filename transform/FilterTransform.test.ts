import { assertEquals } from "../test_deps.ts";
import { FilterTransform } from "./FilterTransform.ts";

Deno.test({
  name: "FilterTransform",
  async fn() {
    // const writableStream = new WritableStream();
    // const writer = writableStream.getWriter();
    const ref: { controller?: ReadableStreamDefaultController } = {
      controller: undefined,
    };
    const readableStream = new ReadableStream({
      start(controller) {
        ref.controller = controller;
      },
    });
    ref.controller?.enqueue("line1");
    ref.controller?.enqueue("line2");
    ref.controller?.enqueue("line3");
    const filterTransform = new FilterTransform((s) => s !== "line2");
    const modifiedStream = readableStream.pipeThrough(filterTransform);
    const reader = modifiedStream.getReader();
    let res = await reader.read();
    assertEquals(res, {
      done: false,
      value: "line1",
    });
    res = await reader.read();
    assertEquals(res, {
      done: false,
      value: "line3",
    });
    //   await reader.cancel();
    // await readableStream.cancel();
    // await modifiedStream.cancel();
    // // await reader.cancel();
    // assertEquals(modifiedStream.locked, true);
  },
});
