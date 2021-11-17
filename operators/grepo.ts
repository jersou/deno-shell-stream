import { ShellStream } from "../shell_stream.ts";
import { Operator } from "../types.ts";
import { grep } from "./grep.ts";

export const grepo: Operator = (regex: RegExp | string) =>
  (shellStream: ShellStream) => {
    return grep(regex, { onlyMatching: true })(shellStream);
  };
