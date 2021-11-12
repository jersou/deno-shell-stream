import { ShellStream } from "../shell_stream.js";
export const timestamp = () => (shellStream) => {
    const inputGenerator = (async function* () {
        for await (const line of shellStream.generator) {
            const ts = new Date().toISOString();
            yield `${ts} ${line}`;
        }
    })();
    return ShellStream.builder(inputGenerator, shellStream);
};
