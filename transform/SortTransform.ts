export type CompareFn<T> = (a: T, b: T) => number;

export class SortTransform<T> extends TransformStream<T> {
  constructor(compareFn?: CompareFn<T>) {
    super(new SortTransformer<T>(compareFn));
  }
}

export class SortTransformer<T> implements Transformer<T> {
  buffer: T[] = [];
  constructor(private compareFn?: CompareFn<T>) {}
  transform(line: T) {
    this.buffer.push(line);
  }
  flush(controller: TransformStreamDefaultController<T>) {
    this.buffer.sort(this.compareFn);
    for (const line of this.buffer) {
      controller.enqueue(line);
    }
  }
}
