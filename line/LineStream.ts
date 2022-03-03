import { MapFunction, MapTransform } from "../transform/MapTransform.ts";
import {
  FilterFunction,
  FilterTransform,
} from "../transform/FilterTransform.ts";
import { GrepoTransform } from "../transform/GrepoTransform.ts";
import { streamToArray } from "../utils/StreamToArray.ts";
import {
  TextLineStream,
} from "https://deno.land/std@0.128.0/streams/delimiter.ts";

export type TapFunction<T> = (line: T) => unknown;
export type LogTransformFunction<T> = (line: T) => string;

export class LineStream<T> {
  child?: LineStream<unknown>;

  constructor(
    public parent?: LineStream<unknown> | undefined,
    public linesStream?: ReadableStream<T> | undefined,
  ) {
  }

  // overwrite this method !
  toStringReadableStream() {
    return this.linesStream!;
  }

  // overwrite this method !
  toByteReadableStream(): ReadableStream<Uint8Array> {
    let isFirst = true;
    const addLineBreakFn = (line: T) => {
      if (isFirst) {
        isFirst = false;
        return line;
      } else {
        return "\n" + line;
      }
    };
    return this.getLineReadableStream()
      .pipeThrough(new MapTransform(addLineBreakFn))
      .pipeThrough(new TextEncoderStream());
  }

  getLineReadableStream(): ReadableStream<T> {
    return this.linesStream!;
  }

  async wait(): Promise<this> {
    await this.getLineReadableStream().pipeTo(new WritableStream<T>());
    await this.parent?.wait();
    return this;
  }

  map<U>(mapFunction: MapFunction<T, U>) {
    return this.transform<U>(new MapTransform(mapFunction));
  }

  tap(tapFunction: TapFunction<T>) {
    return this.transform(
      new MapTransform((str) => {
        tapFunction(str);
        return str;
      }),
    );
  }

  // FIXME use tap()
  log(transform?: LogTransformFunction<T>) {
    return this.tap((line) =>
      transform ? console.log(transform(line)) : console.log(line)
    );
  }

  logJson(replacer = null, space = "  ") {
    return this.log((el) => JSON.stringify(el, replacer, space));
  }

  filter(filterFunction: FilterFunction<T>) {
    return this.transform(new FilterTransform(filterFunction));
  }

  transform<U>(transformStream: TransformStream<T, U>): LineStream<U> {
    this.child = new LineStream<U>(
      this,
      this.getLineReadableStream().pipeThrough(transformStream),
    );
    return this.child as LineStream<U>;
  }

  grep(
    regex: RegExp | string,
    opt?: { onlyMatching?: boolean },
  ): LineStream<string | T> {
    const regEx = regex instanceof RegExp ? regex : new RegExp(regex);
    if (opt?.onlyMatching) {
      return this.transform(new GrepoTransform(regEx));
    } else {
      return this.filter((line: T) => regEx.test(String(line)));
    }
  }

  grepo(regex: RegExp | string) {
    return this.grep(regex, { onlyMatching: true });
  }

  async toArray() {
    const array = await streamToArray(this.getLineReadableStream());
    await this.wait();
    return array;
  }

  async toFile(file: Deno.FsFile | string) {
    let fsFile;
    if (typeof file === "string") {
      fsFile = await Deno.create(file);
    } else {
      fsFile = file;
    }
    await this.toByteReadableStream().pipeTo(fsFile.writable);
    await this.wait();
  }

  async toString() {
    return (await this.toArray()).join("\n");
  }

  // run(){
  //  TODO generic,call
  // }
}
