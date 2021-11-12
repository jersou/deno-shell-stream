import * as denoShim from "deno.ns";
/** Create a `Deno.Reader` from an iterable of `Uint8Array`s.
 *
 * ```ts
 *      import { readerFromIterable } from "./conversion.ts";
 *      import { serve } from "../http/server_legacy.ts";
 *
 *      for await (const request of serve({ port: 8000 })) {
 *        // Server-sent events: Send runtime metrics to the client every second.
 *        request.respond({
 *          headers: new Headers({ "Content-Type": "text/event-stream" }),
 *          body: readerFromIterable((async function* () {
 *            while (true) {
 *              await new Promise((r) => setTimeout(r, 1000));
 *              const message = `data: ${JSON.stringify(Deno.metrics())}\n\n`;
 *              yield new TextEncoder().encode(message);
 *            }
 *          })()),
 *        });
 *      }
 * ```
 */
export declare function readerFromIterable(iterable: Iterable<Uint8Array> | AsyncIterable<Uint8Array>): denoShim.Deno.Reader;
/** Create a `Writer` from a `WritableStreamDefaultWriter`. */
export declare function writerFromStreamWriter(streamWriter: WritableStreamDefaultWriter<Uint8Array>): denoShim.Deno.Writer;
/** Create a `Reader` from a `ReadableStreamDefaultReader`. */
export declare function readerFromStreamReader(streamReader: ReadableStreamDefaultReader<Uint8Array>): denoShim.Deno.Reader;
export interface WritableStreamFromWriterOptions {
    /**
     * If the `writer` is also a `Deno.Closer`, automatically close the `writer`
     * when the stream is closed, aborted, or a write error occurs.
     *
     * Defaults to `true`. */
    autoClose?: boolean;
}
/** Create a `WritableStream` from a `Writer`. */
export declare function writableStreamFromWriter(writer: denoShim.Deno.Writer, options?: WritableStreamFromWriterOptions): WritableStream<Uint8Array>;
/** Create a `ReadableStream` from any kind of iterable.
 *
 * ```ts
 *      import { readableStreamFromIterable } from "./conversion.ts";
 *
 *      const r1 = readableStreamFromIterable(["foo, bar, baz"]);
 *      const r2 = readableStreamFromIterable(async function* () {
 *        await new Promise(((r) => setTimeout(r, 1000)));
 *        yield "foo";
 *        await new Promise(((r) => setTimeout(r, 1000)));
 *        yield "bar";
 *        await new Promise(((r) => setTimeout(r, 1000)));
 *        yield "baz";
 *      }());
 * ```
 *
 * If the produced iterator (`iterable[Symbol.asyncIterator]()` or
 * `iterable[Symbol.iterator]()`) is a generator, or more specifically is found
 * to have a `.throw()` method on it, that will be called upon
 * `readableStream.cancel()`. This is the case for the second input type above:
 *
 * ```ts
 * import { readableStreamFromIterable } from "./conversion.ts";
 *
 * const r3 = readableStreamFromIterable(async function* () {
 *   try {
 *     yield "foo";
 *   } catch (error) {
 *     console.log(error); // Error: Cancelled by consumer.
 *   }
 * }());
 * const reader = r3.getReader();
 * console.log(await reader.read()); // { value: "foo", done: false }
 * await reader.cancel(new Error("Cancelled by consumer."));
 * ```
 */
export declare function readableStreamFromIterable<T>(iterable: Iterable<T> | AsyncIterable<T>): ReadableStream<T>;
export interface ReadableStreamFromReaderOptions {
    /** If the `reader` is also a `Deno.Closer`, automatically close the `reader`
     * when `EOF` is encountered, or a read error occurs.
     *
     * Defaults to `true`. */
    autoClose?: boolean;
    /** The size of chunks to allocate to read, the default is ~16KiB, which is
     * the maximum size that Deno operations can currently support. */
    chunkSize?: number;
    /** The queuing strategy to create the `ReadableStream` with. */
    strategy?: {
        highWaterMark?: number | undefined;
        size?: undefined;
    };
}
/**
 * Create a `ReadableStream<Uint8Array>` from from a `Deno.Reader`.
 *
 * When the pull algorithm is called on the stream, a chunk from the reader
 * will be read.  When `null` is returned from the reader, the stream will be
 * closed along with the reader (if it is also a `Deno.Closer`).
 *
 * An example converting a `Deno.File` into a readable stream:
 *
 * ```ts
 * import { readableStreamFromReader } from "./mod.ts";
 *
 * const file = await Deno.open("./file.txt", { read: true });
 * const fileStream = readableStreamFromReader(file);
 * ```
 */
export declare function readableStreamFromReader(reader: denoShim.Deno.Reader | (denoShim.Deno.Reader & denoShim.Deno.Closer), options?: ReadableStreamFromReaderOptions): ReadableStream<Uint8Array>;
/** Read Reader `r` until EOF (`null`) and resolve to the content as
 * Uint8Array`.
 *
 * ```ts
 * import { Buffer } from "../io/buffer.ts";
 * import { readAll } from "./conversion.ts";
 *
 * // Example from stdin
 * const stdinContent = await readAll(Deno.stdin);
 *
 * // Example from file
 * const file = await Deno.open("my_file.txt", {read: true});
 * const myFileContent = await readAll(file);
 * Deno.close(file.rid);
 *
 * // Example from buffer
 * const myData = new Uint8Array(100);
 * // ... fill myData array with data
 * const reader = new Buffer(myData.buffer);
 * const bufferContent = await readAll(reader);
 * ```
 */
export declare function readAll(r: denoShim.Deno.Reader): Promise<Uint8Array>;
/** Synchronously reads Reader `r` until EOF (`null`) and returns the content
 * as `Uint8Array`.
 *
 * ```ts
 * import { Buffer } from "../io/buffer.ts";
 * import { readAllSync } from "./conversion.ts";
 *
 * // Example from stdin
 * const stdinContent = readAllSync(Deno.stdin);
 *
 * // Example from file
 * const file = Deno.openSync("my_file.txt", {read: true});
 * const myFileContent = readAllSync(file);
 * Deno.close(file.rid);
 *
 * // Example from buffer
 * const myData = new Uint8Array(100);
 * // ... fill myData array with data
 * const reader = new Buffer(myData.buffer);
 * const bufferContent = readAllSync(reader);
 * ```
 */
export declare function readAllSync(r: denoShim.Deno.ReaderSync): Uint8Array;
/** Write all the content of the array buffer (`arr`) to the writer (`w`).
 *
 * ```ts
 * import { Buffer } from "../io/buffer.ts";
 * import { writeAll } from "./conversion.ts";

 * // Example writing to stdout
 * let contentBytes = new TextEncoder().encode("Hello World");
 * await writeAll(Deno.stdout, contentBytes);
 *
 * // Example writing to file
 * contentBytes = new TextEncoder().encode("Hello World");
 * const file = await Deno.open('test.file', {write: true});
 * await writeAll(file, contentBytes);
 * Deno.close(file.rid);
 *
 * // Example writing to buffer
 * contentBytes = new TextEncoder().encode("Hello World");
 * const writer = new Buffer();
 * await writeAll(writer, contentBytes);
 * console.log(writer.bytes().length);  // 11
 * ```
 */
export declare function writeAll(w: denoShim.Deno.Writer, arr: Uint8Array): Promise<void>;
/** Synchronously write all the content of the array buffer (`arr`) to the
 * writer (`w`).
 *
 * ```ts
 * import { Buffer } from "../io/buffer.ts";
 * import { writeAllSync } from "./conversion.ts";
 *
 * // Example writing to stdout
 * let contentBytes = new TextEncoder().encode("Hello World");
 * writeAllSync(Deno.stdout, contentBytes);
 *
 * // Example writing to file
 * contentBytes = new TextEncoder().encode("Hello World");
 * const file = Deno.openSync('test.file', {write: true});
 * writeAllSync(file, contentBytes);
 * Deno.close(file.rid);
 *
 * // Example writing to buffer
 * contentBytes = new TextEncoder().encode("Hello World");
 * const writer = new Buffer();
 * writeAllSync(writer, contentBytes);
 * console.log(writer.bytes().length);  // 11
 * ```
 */
export declare function writeAllSync(w: denoShim.Deno.WriterSync, arr: Uint8Array): void;
/** Turns a Reader, `r`, into an async iterator.
 *
 * ```ts
 * import { iterateReader } from "./conversion.ts";
 *
 * let f = await Deno.open("/etc/passwd");
 * for await (const chunk of iterateReader(f)) {
 *   console.log(chunk);
 * }
 * f.close();
 * ```
 *
 * Second argument can be used to tune size of a buffer.
 * Default size of the buffer is 32kB.
 *
 * ```ts
 * import { iterateReader } from "./conversion.ts";
 *
 * let f = await Deno.open("/etc/passwd");
 * const it = iterateReader(f, {
 *   bufSize: 1024 * 1024
 * });
 * for await (const chunk of it) {
 *   console.log(chunk);
 * }
 * f.close();
 * ```
 *
 * Iterator uses an internal buffer of fixed size for efficiency; it returns
 * a view on that buffer on each iteration. It is therefore caller's
 * responsibility to copy contents of the buffer if needed; otherwise the
 * next iteration will overwrite contents of previously returned chunk.
 */
export declare function iterateReader(r: denoShim.Deno.Reader, options?: {
    bufSize?: number;
}): AsyncIterableIterator<Uint8Array>;
/** Turns a ReaderSync, `r`, into an iterator.
 *
 * ```ts
 * import { iterateReaderSync } from "./conversion.ts";
 *
 * let f = Deno.openSync("/etc/passwd");
 * for (const chunk of iterateReaderSync(f)) {
 *   console.log(chunk);
 * }
 * f.close();
 * ```
 *
 * Second argument can be used to tune size of a buffer.
 * Default size of the buffer is 32kB.
 *
 * ```ts
 * import { iterateReaderSync } from "./conversion.ts";

 * let f = await Deno.open("/etc/passwd");
 * const iter = iterateReaderSync(f, {
 *   bufSize: 1024 * 1024
 * });
 * for (const chunk of iter) {
 *   console.log(chunk);
 * }
 * f.close();
 * ```
 *
 * Iterator uses an internal buffer of fixed size for efficiency; it returns
 * a view on that buffer on each iteration. It is therefore caller's
 * responsibility to copy contents of the buffer if needed; otherwise the
 * next iteration will overwrite contents of previously returned chunk.
 */
export declare function iterateReaderSync(r: denoShim.Deno.ReaderSync, options?: {
    bufSize?: number;
}): IterableIterator<Uint8Array>;
/** Copies from `src` to `dst` until either EOF (`null`) is read from `src` or
 * an error occurs. It resolves to the number of bytes copied or rejects with
 * the first error encountered while copying.
 *
 * ```ts
 * import { copy } from "./conversion.ts";
 *
 * const source = await Deno.open("my_file.txt");
 * const bytesCopied1 = await copy(source, Deno.stdout);
 * const destination = await Deno.create("my_file_2.txt");
 * const bytesCopied2 = await copy(source, destination);
 * ```
 *
 * @param src The source to copy from
 * @param dst The destination to copy to
 * @param options Can be used to tune size of the buffer. Default size is 32kB
 */
export declare function copy(src: denoShim.Deno.Reader, dst: denoShim.Deno.Writer, options?: {
    bufSize?: number;
}): Promise<number>;
