import * as denoShim from "deno.ns";
import { ShellStream } from "../shell_stream.js";
import { EndOperator } from "../types.js";
import { CloseRes } from "./close.js";

export const toFile: EndOperator<CloseRes> = (outputPath: string) =>
  async (stream: ShellStream) => {
    const closeRes = await stream.close();
    await denoShim.Deno.writeTextFile(outputPath, closeRes.out.join("\n"));
    return closeRes;
  };
