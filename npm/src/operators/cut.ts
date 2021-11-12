import { ShellStream } from "../shell_stream.js";
import { map } from "./map.js";
import { Operator } from "../types.js";

export const cut: Operator = (delim: string, indexes: number[], sep = " ") =>
  (shellStream: ShellStream) =>
    map((line: string) => {
      const parts = line.split(delim);
      return indexes.map((i) => parts[i]).join(sep);
    })(shellStream);
