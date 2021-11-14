import { ShellStream } from "../shell_stream.js";
export const sort = () => (shellStream) => {
    const generator = (async function* () {
        const out = [];
        for await (const line of shellStream.generator) {
            out.push(line);
        }
        for await (const line of out.sort()) {
            yield line;
        }
    })();
    return ShellStream.builder(generator, shellStream);
};
