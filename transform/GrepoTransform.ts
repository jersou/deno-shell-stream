export class GrepoTransform extends TransformStream<string, string> {
  constructor(regex: RegExp | string) {
    super(new GrepoTransformer(regex));
  }
}

export class GrepoTransformer implements Transformer<string, string> {
  constructor(private regex: RegExp | string) {
  }
  transform(
    str: string,
    controller: TransformStreamDefaultController<string>,
  ) {
    const matchs = str.match(this.regex);
    matchs?.forEach((value) => controller.enqueue(value));
  }
}
