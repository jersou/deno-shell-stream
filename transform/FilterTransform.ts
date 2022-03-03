export type FilterFunction<T> = (line: T) => boolean;

export class FilterTransform<T> extends TransformStream<T, T> {
  constructor(filterFunction: FilterFunction<T>) {
    super(new FilterTransformer(filterFunction));
  }
}

export class FilterTransformer<T> implements Transformer<T, T> {
  constructor(private filterFunction: FilterFunction<T>) {
  }
  transform(
    str: T,
    controller: TransformStreamDefaultController<T>,
  ) {
    if (this.filterFunction(str)) {
      controller.enqueue(str);
    }
  }
}
