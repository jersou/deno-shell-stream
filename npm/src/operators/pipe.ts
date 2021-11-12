import { ShellStream } from "../shell_stream.js";
import { Operator, OperatorFunc } from "../types.js";

export const pipe: Operator = (...operators: OperatorFunc[]) =>
  (shellStream: ShellStream) => {
    let current: ShellStream = shellStream;
    for (const operator of operators) {
      current = operator(current);
    }
    return current;
  };
