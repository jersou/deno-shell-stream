import { ShellStream } from "../shell_stream.js";
import { map } from "./map.js";
import { Operator } from "../types.js";

// deno-lint-ignore no-explicit-any
export type Replacer = string | ((substring: string, ...args: any[]) => string);

export const replace: Operator = (
  searchValue: string | RegExp,
  replacer: Replacer,
) =>
  (shellStream: ShellStream) => {
    return map((line: string) => {
      if (typeof replacer === "string") {
        return line.replace(searchValue, replacer);
      } else {
        return line.replace(searchValue, replacer);
      }
    })(shellStream);
  };
