export class SpongeTransform<T> extends TransformStream<T> {
  constructor() {
    super(new SpongeTransformer<T>());
  }
}

export class SpongeTransformer<T> implements Transformer<T> {
  buffer: T[] = [];
  constructor() {}
  transform(line: T) {
    this.buffer.push(line);
  }
  flush(controller: TransformStreamDefaultController<T>) {
    for (const line of this.buffer) {
      controller.enqueue(line);
    }
  }
}
