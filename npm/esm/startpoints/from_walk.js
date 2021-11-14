import { ShellStream } from "../shell_stream.js";
import { walk } from "../deps.js";
export const fromWalk = (path, opt) => () => {
    const generator = (async function* () {
        for await (const dirEntry of walk(path, opt)) {
            yield dirEntry.path;
        }
    })();
    return ShellStream.builder(generator);
};
