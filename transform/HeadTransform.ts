export class HeadTransform<T> extends TransformStream<T> {
  constructor(max: number) {
    super(new HeadTransformer<T>(max));
  }
}

export class HeadTransformer<T> implements Transformer<T> {
  count = 0;
  constructor(private max: number) {}
  transform(line: T, controller: TransformStreamDefaultController<T>) {
    if (this.count < this.max) {
      this.count++;
      controller.enqueue(line);
    }
  }
}
