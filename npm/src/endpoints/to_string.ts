import { EndOperator } from "../types.js";
import { ShellStream } from "../shell_stream.js";
import { close } from "./close.js";

export const toString: EndOperator<string> = () =>
  async (shellStream: ShellStream) =>
    (await close()(shellStream)).out.join("\n");
