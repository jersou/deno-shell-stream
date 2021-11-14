import { ShellStream } from "../shell_stream.js";
export const from = (iterable) => () => {
    const generator = (async function* () {
        for await (const str of iterable) {
            yield str;
        }
    })();
    return ShellStream.builder(generator);
};
