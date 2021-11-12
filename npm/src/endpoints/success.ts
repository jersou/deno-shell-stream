import { EndOperator } from "../types.js";
import { ShellStream } from "../shell_stream.js";
import { close } from "./close.js";

export const success: EndOperator<boolean> = () =>
  async (shellStream: ShellStream) => (await close()(shellStream)).success;
