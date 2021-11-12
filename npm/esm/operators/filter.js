import { ShellStream } from "../shell_stream.js";
export const filter = (filterFunction) => (shellStream) => {
    const generator = (async function* () {
        for await (const line of shellStream.generator) {
            if (filterFunction(line)) {
                yield line;
            }
        }
    })();
    return ShellStream.builder(generator, shellStream);
};
