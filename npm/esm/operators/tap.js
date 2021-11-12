import { ShellStream } from "../shell_stream.js";
export const tap = (tapFunction) => (shellStream) => {
    const generator = (async function* () {
        for await (const line of shellStream.generator) {
            tapFunction(line);
            yield line;
        }
    })();
    return ShellStream.builder(generator, shellStream);
};
