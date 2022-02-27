import { RunOptions, RunStream } from "./run/RunStream.ts";
import { LineStream } from "./line/LineStream.ts";
import { arrayToStream } from "./utils/ArrayToStream.ts";

export class Stream {
  static run(cmdOrStr: string[] | string, opt?: RunOptions): RunStream {
    return new RunStream(cmdOrStr, opt);
  }
  static array(array: string[]): LineStream {
    return new LineStream(null, arrayToStream(array));
  }
}
