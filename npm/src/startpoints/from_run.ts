import { ShellStream } from "../shell_stream.js";
import { StartOperator } from "../types.js";
import { run, RunOptions } from "../operators/run.js";

export const fromRun: StartOperator = (cmd: string[], opt?: RunOptions) =>
  () => run(cmd, opt)(ShellStream.empty());
