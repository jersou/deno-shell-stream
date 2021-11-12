import * as denoShim from "deno.ns";
import { ShellStream } from "../shell_stream.js";
import { readLines } from "../deps.js";
export const run = (cmdOrStr, opt) => (stream) => {
    const generator = (async function* () {
        stream.processCmd = parseCmdString(cmdOrStr);
        stream.process = denoShim.Deno.run({
            cmd: stream.processCmd,
            ...opt,
            stdout: opt?.stdout || (opt?.streamStdErr ? "inherit" : "piped"),
            stderr: opt?.stderr || (opt?.streamStdErr ? "piped" : "inherit"),
            stdin: "piped",
        });
        ShellStream.incProcessCount();
        redirectGeneratorToStdin(stream).then();
        (async () => {
            stream.processStatus = await stream.process.status();
            ShellStream.incProcessDone();
            closeProcess(stream.process);
        })().then();
        try {
            for await (const line of readLines(opt?.streamStdErr ? stream.process.stderr : stream.process.stdout)) {
                yield line;
            }
        }
        catch (_e) {
            // ignore error
        }
        if (opt?.throwIfRunFail && !stream.processStatus.success) {
            throw new Error(`The process ${stream.processCmd[0]} exit error ${stream.processStatus.code}`);
        }
        if (opt?.exitCodeIfRunFail !== undefined) {
            denoShim.Deno.exit(opt?.exitCodeIfRunFail);
        }
    })();
    return ShellStream.builder(generator, stream);
};
async function redirectGeneratorToStdin(stream) {
    const textEncoder = new TextEncoder();
    for await (const line of stream.generator) {
        try {
            await stream.process.stdin.write(textEncoder.encode(line + "\n"));
        }
        catch (_e) {
            break;
        }
    }
    try {
        stream.process.stdin.close();
    }
    catch (_e) {
        // ignore error
    }
}
export function parseCmdString(cmdOrStr) {
    return cmdOrStr instanceof Array ? cmdOrStr : cmdOrStr
        .trim()
        .match(/"(\\"|[^"])*"|'(\\'|[^'])*'|[^ "']+/g)
        .map((p) => p.match(/^"((\\"|[^"])*)"$/)
        ? p.replace(/^"((\\"|[^"])*)"$/, "$1")
        : p.match(/^'((\\'|[^'])*)'$/)
            ? p.replace(/^'((\\'|[^'])*)'$/, "$1")
            : p);
}
export function closeProcess(process) {
    try {
        process.stdin.close();
    }
    catch (_e) {
        // ignore error
    }
    try {
        process.stdout.close();
    }
    catch (_e) {
        // ignore error
    }
    try {
        process.stderr.close();
    }
    catch (_e) {
        // ignore error
    }
    try {
        process.close();
    }
    catch (_e) {
        // ignore error
    }
}
