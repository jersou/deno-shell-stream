import { ShellStream } from "../shell_stream.js";
import { Operator } from "../types.js";
import { tap } from "./tap.js";

export type LogTransformFunction = (line: string) => string;
export const log: Operator = (transform?: LogTransformFunction) =>
  (shellStream: ShellStream) =>
    tap((line: string) =>
      transform ? console.log(transform(line)) : console.log(line)
    )(shellStream);
