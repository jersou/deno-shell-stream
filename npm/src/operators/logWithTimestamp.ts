import { ShellStream } from "../shell_stream.js";
import { Operator } from "../types.js";
import { tap } from "./tap.js";

export const logWithTimestamp: Operator = () =>
  (shellStream: ShellStream) =>
    tap((line: string) => {
      console.log(`${new Date().toISOString()} ${line}`);
    })(shellStream);
