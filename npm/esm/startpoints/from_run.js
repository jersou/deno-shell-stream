import { ShellStream } from "../shell_stream.js";
import { run } from "../operators/run.js";
export const fromRun = (cmd, opt) => () => run(cmd, opt)(ShellStream.empty());
