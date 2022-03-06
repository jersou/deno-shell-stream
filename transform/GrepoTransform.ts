export class GrepoTransform<T> extends TransformStream<T, string> {
  constructor(regex: RegExp | string) {
    super(new GrepoTransformer<T>(regex));
  }
}

export class GrepoTransformer<T> implements Transformer<T, string> {
  constructor(private regex: RegExp | string) {
  }
  transform(
    str: T,
    controller: TransformStreamDefaultController<string>,
  ) {
    const matchs = String(str).match(this.regex);
    matchs?.forEach((value) => controller.enqueue(value));
  }
}
