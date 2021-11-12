import { ShellStream } from "../shell_stream.js";
export const tail = (count = 1) => (shellStream) => {
    const generator = (async function* () {
        const buffer = [];
        for await (const line of shellStream.generator) {
            buffer.push(line);
            if (buffer.length > count) {
                buffer.shift();
            }
        }
        for (const line of buffer) {
            yield line;
        }
    })();
    return ShellStream.builder(generator, shellStream);
};
