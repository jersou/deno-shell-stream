export type MapFunction<T, U> = (line: T) => U;

export class MapTransform<T, U> extends TransformStream<T, U> {
  constructor(mapFunction: MapFunction<T, U>) {
    super(new MapTransformer<T, U>(mapFunction));
  }
}

export class MapTransformer<T, U> implements Transformer<T, U> {
  constructor(private mapFunction: MapFunction<T, U>) {
  }
  transform(
    str: T,
    controller: TransformStreamDefaultController<U>,
  ) {
    controller.enqueue(this.mapFunction(str));
  }
}
