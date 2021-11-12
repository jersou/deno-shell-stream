import { ShellStream } from "../shell_stream.js";
export const map = (mapFunction) => (shellStream) => {
    const generator = (async function* () {
        for await (const line of shellStream.generator) {
            yield mapFunction(line);
        }
    })();
    return ShellStream.builder(generator, shellStream);
};
