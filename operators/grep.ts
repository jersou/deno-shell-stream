import { ShellStream } from "../shell_stream.ts";
import { Operator } from "../types.ts";
import { filter } from "./filter.ts";

export type grepOption = {
  onlyMatching?: boolean;
};

export const grep: Operator = (regex: RegExp | string, opt?: grepOption) =>
  (shellStream: ShellStream) => {
    const regEx = regex instanceof RegExp ? regex : new RegExp(regex, "g");
    if (opt?.onlyMatching) {
      const generator = (async function* () {
        for await (const line of shellStream.generator) {
          for (const res of line.match(regEx) || []) {
            yield res;
          }
        }
      })();
      return ShellStream.builder(generator, shellStream);
    } else {
      return filter((line: string) => regEx.test(line))(shellStream);
    }
  };
