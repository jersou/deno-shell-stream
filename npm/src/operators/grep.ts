import { ShellStream } from "../shell_stream.js";
import { Operator } from "../types.js";
import { filter } from "./filter.js";

export const grep: Operator = (regex: RegExp) =>
  (shellStream: ShellStream) =>
    filter((line: string) => regex.test(line))(shellStream);
