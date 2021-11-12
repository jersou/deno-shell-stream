import { ShellStream } from "../shell_stream.js";
export const fromArray = (lines) => () => {
    const generator = (async function* () {
        for await (const line of lines) {
            yield line;
        }
    })();
    return ShellStream.builder(generator);
};
