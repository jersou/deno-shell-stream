import { RunStream } from "../run/RunStream.ts";
import {
  FilterFunction,
  FilterTransform,
} from "../transform/FilterTransform.ts";
import { streamToArray } from "../utils/StreamToArray.ts";
import { GrepoTransform } from "../transform/GrepoTransform.ts";
import { MapFunction, MapTransform } from "../transform/MapTransform.ts";

export type TapFunction = (line: string) => unknown;

export class LineStream {
  child?: LineStream;
  constructor(
    public parent: RunStream | LineStream | null,
    public linesStream: ReadableStream<string>,
  ) {
  }

  async wait() {
    await this.linesStream.pipeTo(new WritableStream<string>());
    await this.parent?.wait();
  }

  map(mapFunction: MapFunction) {
    return this.transform(new MapTransform(mapFunction));
  }

  tap(tapFunction: TapFunction) {
    return this.transform(
      new MapTransform((str) => {
        tapFunction(str);
        return str;
      }),
    );
  }

  // FIXME use tap()
  log() {
    return this.tap((str) => console.log(str));
  }

  filter(filterFunction: FilterFunction) {
    return this.transform(new FilterTransform(filterFunction));
  }

  transform(transformStream: TransformStream<string, string>) {
    this.child = new LineStream(
      this,
      this.linesStream.pipeThrough(transformStream),
    );
    return this.child;
  }

  grep(regex: RegExp | string, opt?: { onlyMatching?: boolean }) {
    const regEx = regex instanceof RegExp ? regex : new RegExp(regex);
    if (opt?.onlyMatching) {
      return this.transform(new GrepoTransform(regEx));
    } else {
      return this.filter((line) => regEx.test(line));
    }
  }

  grepo(regex: RegExp | string) {
    return this.grep(regex, { onlyMatching: true });
  }

  async array() {
    const array = await streamToArray(this.linesStream);
    await this.wait();
    return array;
  }

  async string() {
    return (await this.array()).join("\n");
  }
}
