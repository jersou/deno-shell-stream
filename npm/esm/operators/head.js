import { ShellStream } from "../shell_stream.js";
export const head = (count = 1) => (shellStream) => {
    const generator = (async function* () {
        let i = 0;
        for await (const line of shellStream.generator) {
            yield line;
            i++;
            if (i >= count) {
                break;
            }
        }
    })();
    return ShellStream.builder(generator, shellStream);
};
