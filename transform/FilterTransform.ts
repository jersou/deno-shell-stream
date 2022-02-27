export type FilterFunction = (line: string) => boolean;

export class FilterTransform extends TransformStream<string, string> {
  constructor(filterFunction: FilterFunction) {
    super(new FilterTransformer(filterFunction));
  }
}

export class FilterTransformer implements Transformer<string, string> {
  constructor(private filterFunction: FilterFunction) {
  }
  transform(
    str: string,
    controller: TransformStreamDefaultController<string>,
  ) {
    if (this.filterFunction(str)) {
      controller.enqueue(str);
    }
  }
}
