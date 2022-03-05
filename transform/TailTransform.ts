export class TailTransform<T> extends TransformStream<T> {
  constructor(max: number) {
    super(new TailTransformer<T>(max));
  }
}

export class TailTransformer<T> implements Transformer<T> {
  buffer: T[] = [];
  constructor(private max: number) {}
  transform(line: T) {
    this.buffer.push(line);
    if (this.buffer.length > this.max) {
      this.buffer.shift();
    }
  }
  flush(controller: TransformStreamDefaultController<T>) {
    for (const line of this.buffer) {
      controller.enqueue(line);
    }
  }
}
