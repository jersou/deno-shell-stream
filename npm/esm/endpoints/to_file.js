import * as denoShim from "deno.ns";
export const toFile = (outputPath) => async (stream) => {
    const closeRes = await stream.close();
    await denoShim.Deno.writeTextFile(outputPath, closeRes.out.join("\n"));
    return closeRes;
};
