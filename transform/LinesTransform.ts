export class LinesTransform extends TransformStream<string, string> {
  constructor() {
    super(new LinesTransformer());
  }
}

export class LinesTransformer implements Transformer<string, string> {
  buffer: string[] = [];

  async transform(
    str: string,
    controller: TransformStreamDefaultController<string>,
  ) {
    const parts = str.split("\n");
    if (parts.length > 1) {
      const first = parts.shift();
      await controller.enqueue(
        [...this.buffer, first].join(""),
      );
      const last = parts.pop() || "";
      this.buffer = [last];
      for (const part of parts) {
        await controller.enqueue(part);
      }
    } else {
      this.buffer.push(parts[0]);
    }
  }

  async flush(controller: TransformStreamDefaultController<string>) {
    if (this.buffer.length) {
      await controller.enqueue(this.buffer.join(""));
    }
  }
}
