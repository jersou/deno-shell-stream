import type { Reader, ReaderSync, Writer, WriterSync } from "./types.d.js";
/** A variable-sized buffer of bytes with `read()` and `write()` methods.
 *
 * Buffer is almost always used with some I/O like files and sockets. It allows
 * one to buffer up a download from a socket. Buffer grows and shrinks as
 * necessary.
 *
 * Buffer is NOT the same thing as Node's Buffer. Node's Buffer was created in
 * 2009 before JavaScript had the concept of ArrayBuffers. It's simply a
 * non-standard ArrayBuffer.
 *
 * ArrayBuffer is a fixed memory allocation. Buffer is implemented on top of
 * ArrayBuffer.
 *
 * Based on [Go Buffer](https://golang.org/pkg/bytes/#Buffer). */
export declare class Buffer {
    #private;
    constructor(ab?: ArrayBufferLike | ArrayLike<number>);
    /** Returns a slice holding the unread portion of the buffer.
     *
     * The slice is valid for use only until the next buffer modification (that
     * is, only until the next call to a method like `read()`, `write()`,
     * `reset()`, or `truncate()`). If `options.copy` is false the slice aliases the buffer content at
     * least until the next buffer modification, so immediate changes to the
     * slice will affect the result of future reads.
     * @param options Defaults to `{ copy: true }`
     */
    bytes(options?: {
        copy: boolean;
    }): Uint8Array;
    /** Returns whether the unread portion of the buffer is empty. */
    empty(): boolean;
    /** A read only number of bytes of the unread portion of the buffer. */
    get length(): number;
    /** The read only capacity of the buffer's underlying byte slice, that is,
     * the total space allocated for the buffer's data. */
    get capacity(): number;
    /** Discards all but the first `n` unread bytes from the buffer but
     * continues to use the same allocated storage. It throws if `n` is
     * negative or greater than the length of the buffer. */
    truncate(n: number): void;
    reset(): void;
    /** Reads the next `p.length` bytes from the buffer or until the buffer is
     * drained. Returns the number of bytes read. If the buffer has no data to
     * return, the return is EOF (`null`). */
    readSync(p: Uint8Array): number | null;
    /** Reads the next `p.length` bytes from the buffer or until the buffer is
     * drained. Resolves to the number of bytes read. If the buffer has no
     * data to return, resolves to EOF (`null`).
     *
     * NOTE: This methods reads bytes synchronously; it's provided for
     * compatibility with `Reader` interfaces.
     */
    read(p: Uint8Array): Promise<number | null>;
    writeSync(p: Uint8Array): number;
    /** NOTE: This methods writes bytes synchronously; it's provided for
     * compatibility with `Writer` interface. */
    write(p: Uint8Array): Promise<number>;
    /** Grows the buffer's capacity, if necessary, to guarantee space for
     * another `n` bytes. After `.grow(n)`, at least `n` bytes can be written to
     * the buffer without another allocation. If `n` is negative, `.grow()` will
     * throw. If the buffer can't grow it will throw an error.
     *
     * Based on Go Lang's
     * [Buffer.Grow](https://golang.org/pkg/bytes/#Buffer.Grow). */
    grow(n: number): void;
    /** Reads data from `r` until EOF (`null`) and appends it to the buffer,
     * growing the buffer as needed. It resolves to the number of bytes read.
     * If the buffer becomes too large, `.readFrom()` will reject with an error.
     *
     * Based on Go Lang's
     * [Buffer.ReadFrom](https://golang.org/pkg/bytes/#Buffer.ReadFrom). */
    readFrom(r: Reader): Promise<number>;
    /** Reads data from `r` until EOF (`null`) and appends it to the buffer,
     * growing the buffer as needed. It returns the number of bytes read. If the
     * buffer becomes too large, `.readFromSync()` will throw an error.
     *
     * Based on Go Lang's
     * [Buffer.ReadFrom](https://golang.org/pkg/bytes/#Buffer.ReadFrom). */
    readFromSync(r: ReaderSync): number;
}
export declare class BufferFullError extends Error {
    partial: Uint8Array;
    name: string;
    constructor(partial: Uint8Array);
}
export declare class PartialReadError extends Error {
    name: string;
    partial?: Uint8Array;
    constructor();
}
/** Result type returned by of BufReader.readLine(). */
export interface ReadLineResult {
    line: Uint8Array;
    more: boolean;
}
/** BufReader implements buffering for a Reader object. */
export declare class BufReader implements Reader {
    private buf;
    private rd;
    private r;
    private w;
    private eof;
    /** return new BufReader unless r is BufReader */
    static create(r: Reader, size?: number): BufReader;
    constructor(rd: Reader, size?: number);
    /** Returns the size of the underlying buffer in bytes. */
    size(): number;
    buffered(): number;
    private _fill;
    /** Discards any buffered data, resets all state, and switches
     * the buffered reader to read from r.
     */
    reset(r: Reader): void;
    private _reset;
    /** reads data into p.
     * It returns the number of bytes read into p.
     * The bytes are taken from at most one Read on the underlying Reader,
     * hence n may be less than len(p).
     * To read exactly len(p) bytes, use io.ReadFull(b, p).
     */
    read(p: Uint8Array): Promise<number | null>;
    /** reads exactly `p.length` bytes into `p`.
     *
     * If successful, `p` is returned.
     *
     * If the end of the underlying stream has been reached, and there are no more
     * bytes available in the buffer, `readFull()` returns `null` instead.
     *
     * An error is thrown if some bytes could be read, but not enough to fill `p`
     * entirely before the underlying stream reported an error or EOF. Any error
     * thrown will have a `partial` property that indicates the slice of the
     * buffer that has been successfully filled with data.
     *
     * Ported from https://golang.org/pkg/io/#ReadFull
     */
    readFull(p: Uint8Array): Promise<Uint8Array | null>;
    /** Returns the next byte [0, 255] or `null`. */
    readByte(): Promise<number | null>;
    /** readString() reads until the first occurrence of delim in the input,
     * returning a string containing the data up to and including the delimiter.
     * If ReadString encounters an error before finding a delimiter,
     * it returns the data read before the error and the error itself
     * (often `null`).
     * ReadString returns err != nil if and only if the returned data does not end
     * in delim.
     * For simple uses, a Scanner may be more convenient.
     */
    readString(delim: string): Promise<string | null>;
    /** `readLine()` is a low-level line-reading primitive. Most callers should
     * use `readString('\n')` instead or use a Scanner.
     *
     * `readLine()` tries to return a single line, not including the end-of-line
     * bytes. If the line was too long for the buffer then `more` is set and the
     * beginning of the line is returned. The rest of the line will be returned
     * from future calls. `more` will be false when returning the last fragment
     * of the line. The returned buffer is only valid until the next call to
     * `readLine()`.
     *
     * The text returned from ReadLine does not include the line end ("\r\n" or
     * "\n").
     *
     * When the end of the underlying stream is reached, the final bytes in the
     * stream are returned. No indication or error is given if the input ends
     * without a final line end. When there are no more trailing bytes to read,
     * `readLine()` returns `null`.
     *
     * Calling `unreadByte()` after `readLine()` will always unread the last byte
     * read (possibly a character belonging to the line end) even if that byte is
     * not part of the line returned by `readLine()`.
     */
    readLine(): Promise<ReadLineResult | null>;
    /** `readSlice()` reads until the first occurrence of `delim` in the input,
     * returning a slice pointing at the bytes in the buffer. The bytes stop
     * being valid at the next read.
     *
     * If `readSlice()` encounters an error before finding a delimiter, or the
     * buffer fills without finding a delimiter, it throws an error with a
     * `partial` property that contains the entire buffer.
     *
     * If `readSlice()` encounters the end of the underlying stream and there are
     * any bytes left in the buffer, the rest of the buffer is returned. In other
     * words, EOF is always treated as a delimiter. Once the buffer is empty,
     * it returns `null`.
     *
     * Because the data returned from `readSlice()` will be overwritten by the
     * next I/O operation, most clients should use `readString()` instead.
     */
    readSlice(delim: number): Promise<Uint8Array | null>;
    /** `peek()` returns the next `n` bytes without advancing the reader. The
     * bytes stop being valid at the next read call.
     *
     * When the end of the underlying stream is reached, but there are unread
     * bytes left in the buffer, those bytes are returned. If there are no bytes
     * left in the buffer, it returns `null`.
     *
     * If an error is encountered before `n` bytes are available, `peek()` throws
     * an error with the `partial` property set to a slice of the buffer that
     * contains the bytes that were available before the error occurred.
     */
    peek(n: number): Promise<Uint8Array | null>;
}
declare abstract class AbstractBufBase {
    buf: Uint8Array;
    usedBufferBytes: number;
    err: Error | null;
    /** Size returns the size of the underlying buffer in bytes. */
    size(): number;
    /** Returns how many bytes are unused in the buffer. */
    available(): number;
    /** buffered returns the number of bytes that have been written into the
     * current buffer.
     */
    buffered(): number;
}
/** BufWriter implements buffering for an deno.Writer object.
 * If an error occurs writing to a Writer, no more data will be
 * accepted and all subsequent writes, and flush(), will return the error.
 * After all data has been written, the client should call the
 * flush() method to guarantee all data has been forwarded to
 * the underlying deno.Writer.
 */
export declare class BufWriter extends AbstractBufBase implements Writer {
    private writer;
    /** return new BufWriter unless writer is BufWriter */
    static create(writer: Writer, size?: number): BufWriter;
    constructor(writer: Writer, size?: number);
    /** Discards any unflushed buffered data, clears any error, and
     * resets buffer to write its output to w.
     */
    reset(w: Writer): void;
    /** Flush writes any buffered data to the underlying io.Writer. */
    flush(): Promise<void>;
    /** Writes the contents of `data` into the buffer.  If the contents won't fully
     * fit into the buffer, those bytes that can are copied into the buffer, the
     * buffer is the flushed to the writer and the remaining bytes are copied into
     * the now empty buffer.
     *
     * @return the number of bytes written to the buffer.
     */
    write(data: Uint8Array): Promise<number>;
}
/** BufWriterSync implements buffering for a deno.WriterSync object.
 * If an error occurs writing to a WriterSync, no more data will be
 * accepted and all subsequent writes, and flush(), will return the error.
 * After all data has been written, the client should call the
 * flush() method to guarantee all data has been forwarded to
 * the underlying deno.WriterSync.
 */
export declare class BufWriterSync extends AbstractBufBase implements WriterSync {
    private writer;
    /** return new BufWriterSync unless writer is BufWriterSync */
    static create(writer: WriterSync, size?: number): BufWriterSync;
    constructor(writer: WriterSync, size?: number);
    /** Discards any unflushed buffered data, clears any error, and
     * resets buffer to write its output to w.
     */
    reset(w: WriterSync): void;
    /** Flush writes any buffered data to the underlying io.WriterSync. */
    flush(): void;
    /** Writes the contents of `data` into the buffer.  If the contents won't fully
     * fit into the buffer, those bytes that can are copied into the buffer, the
     * buffer is the flushed to the writer and the remaining bytes are copied into
     * the now empty buffer.
     *
     * @return the number of bytes written to the buffer.
     */
    writeSync(data: Uint8Array): number;
}
/** Read delimited bytes from a Reader. */
export declare function readDelim(reader: Reader, delim: Uint8Array): AsyncIterableIterator<Uint8Array>;
/** Read delimited strings from a Reader. */
export declare function readStringDelim(reader: Reader, delim: string, decoderOpts?: {
    encoding?: string;
    fatal?: boolean;
    ignoreBOM?: boolean;
}): AsyncIterableIterator<string>;
/** Read strings line-by-line from a Reader. */
export declare function readLines(reader: Reader, decoderOpts?: {
    encoding?: string;
    fatal?: boolean;
    ignoreBOM?: boolean;
}): AsyncIterableIterator<string>;
export {};
