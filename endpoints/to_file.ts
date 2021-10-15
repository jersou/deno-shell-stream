import { ShellStream } from "../shell_stream.ts";
import { EndOperator } from "../types.ts";
import { CloseRes } from "./close.ts";

export const toFile: EndOperator<CloseRes> = (outputPath: string) =>
  (stream: ShellStream) => {
    return stream.tee(outputPath).close();
  };
