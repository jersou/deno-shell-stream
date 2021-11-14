import { ShellStream } from "../shell_stream.js";
export const uniq = () => (shellStream) => {
    const generator = (async function* () {
        let lastEmit;
        for await (const line of shellStream.generator) {
            if (lastEmit !== line) {
                lastEmit = line;
                yield line;
            }
        }
    })();
    return ShellStream.builder(generator, shellStream);
};
