import { RunOptions, RunStream } from "./run/RunStream.ts";
import { arrayToStream } from "./utils/ArrayToStream.ts";
import { FileStream } from "./file/FileStream.ts";
import { LineStream } from "./line/LineStream.ts";
import { dirToStream } from "./utils/dirToStream.ts";
import { walkToStream } from "./utils/walkToStream.ts";
import { WalkEntry, WalkOptions } from "./deps.ts";

export abstract class Stream {
  static fromRun(cmdOrStr: string[] | string, opt?: RunOptions): RunStream {
    return new RunStream(cmdOrStr, opt);
  }

  static fromFile(file: Deno.FsFile | string): FileStream {
    return new FileStream(file);
  }

  static fromLineStream<T>(stream: ReadableStream<T>): LineStream<T> {
    return new LineStream(undefined, stream);
  }

  static fromArray<T>(array: T[]): LineStream<T> {
    return new LineStream(undefined, arrayToStream(array));
  }

  static fromString(str: string): LineStream<string> {
    return new LineStream(undefined, arrayToStream(str.split("\n")));
  }

  static fromDir(path: string): LineStream<Deno.DirEntry> {
    return new LineStream(undefined, dirToStream(path));
  }

  static fromWalk(path: string, opt?: WalkOptions): LineStream<WalkEntry> {
    return new LineStream(undefined, walkToStream(path, opt));
  }
}
