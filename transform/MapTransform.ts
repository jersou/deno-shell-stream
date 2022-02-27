export type MapFunction = (line: string) => string;

export class MapTransform extends TransformStream<string, string> {
  constructor(mapFunction: MapFunction) {
    super(new MapTransformer(mapFunction));
  }
}

export class MapTransformer implements Transformer<string, string> {
  constructor(private mapFunction: MapFunction) {
  }
  transform(
    str: string,
    controller: TransformStreamDefaultController<string>,
  ) {
    controller.enqueue(this.mapFunction(str));
  }
}
