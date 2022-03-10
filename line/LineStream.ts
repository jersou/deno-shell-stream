import { MapFunction, MapTransform } from "../transform/MapTransform.ts";
import {
  FilterFunction,
  FilterTransform,
} from "../transform/FilterTransform.ts";
import { GrepoTransform } from "../transform/GrepoTransform.ts";
import { streamToArray } from "../utils/StreamToArray.ts";
import { getRunStream, RunOptions, RunStream } from "../run/RunStream.ts";
import { HeadTransform } from "../transform/HeadTransform.ts";
import { TailTransform } from "../transform/TailTransform.ts";
import { SpongeTransform } from "../transform/SpongeTransform.ts";
import { UniqTransform } from "../transform/UniqTransform.ts";
import { CompareFn, SortTransform } from "../transform/SortTransform.ts";

export type TapFunction<T> = (line: T) => unknown;
export type LogTransformFunction<T> = (line: T) => string;

// TODO JSDoc

export class LineStream<T> {
  /**
   * It takes a parent stream and a child stream, and returns a new stream that is
   * the parent stream with the child stream attached to it
   * @param {LineStream<unknown> | undefined} [parent] the parent of this instance.
   * @param {ReadableStream<T> | undefined} [linesStream] The stream to use as input
   */
  constructor(
    public parent?: LineStream<unknown> | undefined,
    public linesStream?: ReadableStream<T> | undefined,
  ) {
  }

  /**
   * @returns an array of all the parents of the current stream
   */
  getParents(): LineStream<unknown>[] {
    if (this.parent) {
      return [...this.parent.getParents(), this.parent];
    } else {
      return [];
    }
  }

  /**
   * convert the stream output to stream of lines
   * @returns linesStream
   */
  getLineReadableStream() {
    return this.linesStream!;
  }

  /**
   * @returns the file readable of the stream
   */
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

  async wait(opt?: { checkSuccess?: boolean }): Promise<this> {
    await this.getLineReadableStream().pipeTo(new WritableStream<T>());
    await this.parent?.wait(opt);
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

  log(transform?: LogTransformFunction<T>) {
    return this.tap((line) =>
      transform ? console.log(transform(line)) : console.log(line)
    );
  }

  logJson(replacer = null, space = "  ") {
    return this.log((el) => JSON.stringify(el, replacer, space));
  }

  logWithTimestamp(transform?: LogTransformFunction<string>) {
    return this.tap((line) =>
      transform
        ? console.log(transform(`${new Date().toISOString()} ${line}`))
        : console.log(`${new Date().toISOString()} ${line}`)
    );
  }

  filter(filterFunction: FilterFunction<T>) {
    return this.transform(new FilterTransform(filterFunction));
  }

  transform<U>(transformStream: TransformStream<T, U>): LineStream<U> {
    return new LineStream<U>(
      this,
      this.getLineReadableStream().pipeThrough(transformStream),
    );
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

  async toArray(): Promise<T[]> {
    const array = await streamToArray(this.getLineReadableStream());
    await this.wait();
    return array;
  }

  /**
   * Write the stream output in the file
   * @param {Deno.FsFile | string} file file to write
   * @returns promise of itself.
   */
  async toFile(file: Deno.FsFile | string) {
    let fsFile;
    if (typeof file === "string") {
      fsFile = await Deno.create(file);
    } else {
      fsFile = file;
    }
    await this.toByteReadableStream().pipeTo(fsFile.writable);
    return await this.wait();
  }

  /**
   * @returns A promise of output of the stream, as string
   */
  async toString(): Promise<string> {
    return (await this.toArray()).join("\n");
  }

  /**
   * @returns A promise of output of the stream, as Uint8Array
   */
  async toBytes(): Promise<Uint8Array> {
    return new TextEncoder().encode(await this.toString());
  }

  run(cmdOrStr: string[] | string, opt: RunOptions = {}): RunStream {
    return new RunStream(cmdOrStr, opt, this);
  }

  toIterable(): AsyncIterable<T> {
    const stream: ReadableStream<T> = this.getLineReadableStream();
    return (async function* () {
      const reader = stream.getReader();
      let res;
      while (!res?.done) {
        res = await reader.read();
        if (!res?.done) {
          yield res.value as T;
        }
      }
    })();
  }

  cut(delim: string, indexes: number[]) {
    return this.map((line: T) => {
      const parts = String(line).split(delim);
      return indexes.map((i) => parts[i]);
    });
  }

  replace(searchValue: string | RegExp, replacer: string) {
    return this.map((line: T) => String(line).replace(searchValue, replacer));
  }

  tee(path: string): LineStream<T | string> {
    if (this.linesStream) {
      const streams = this.linesStream.tee();
      this.linesStream = streams[0];
      new LineStream(this, streams[1]).toFile(path).then();
      return this;
    } else {
      const streams = this.toByteReadableStream().tee();
      Deno.create(path).then((file) => streams[1].pipeTo(file.writable).then());
      return new LineStream(
        this,
        streams[0].pipeThrough(new TextDecoderStream()),
      );
    }
  }

  head(max = 1) {
    return this.transform(new HeadTransform(max));
  }

  tail(max = 1) {
    return this.transform(new TailTransform(max));
  }

  sponge() {
    return this.transform(new SpongeTransform());
  }

  /**
   * Emits element only if the element is different from the previous line
   */
  uniq() {
    return this.transform(new UniqTransform());
  }

  /* sorts its input and returms a sorted stream */
  sort(compareFn?: CompareFn<T>) {
    return this.transform(new SortTransform(compareFn));
  }

  /**
   * @returns true is the stream is successfully and if all parent RunStream are successfully
   */
  async success(): Promise<boolean> {
    await this.wait({ checkSuccess: true });
    const isFail: boolean = [...this.getParents(), this]
      .map(getRunStream)
      .some((r) => r?.processStatus?.success === false);
    return !isFail;
  }

  /**
   * @returns true is the stream have at least one fail (current or a parent)
   */
  async fail() {
    return !await this.success();
  }
}
