import * as denoShim from "deno.ns";
import { ShellStream } from "../shell_stream.js";
export const fromDir = (path) => () => {
    const generator = (async function* () {
        for await (const dirEntry of denoShim.Deno.readDir(path)) {
            yield dirEntry.name;
        }
    })();
    return ShellStream.builder(generator);
};
