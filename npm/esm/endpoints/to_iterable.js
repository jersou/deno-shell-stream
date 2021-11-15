export const toIterable = () => (stream) => {
    return (async function* () {
        for await (const line of stream.generator) {
            yield line;
        }
        await stream.close();
    })();
};
