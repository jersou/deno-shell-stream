import { readAll, TextLineStream } from "../deps.ts";
import { LineStream } from "../line/LineStream.ts";

export type RunOptions = Omit<Deno.RunOptions, "cmd"> & {
  dontThrowIfRunFail?: boolean;
  dontThrowIfStdinError?: boolean;
};

export class FileStream extends LineStream<string> {
  fsFile: Deno.FsFile;
  byteReadableStream?: ReadableStream;

  constructor(file: Deno.FsFile | string, parent?: LineStream<unknown>) {
    super(parent);
    this.fsFile = (typeof file === "string") ? Deno.openSync(file) : file;
  }

  getLineReadableStream(): ReadableStream<string> {
    if (!this.linesStream) {
      this.linesStream = this.toStringReadableStream().pipeThrough(
        new TextLineStream(),
      );
    }
    return this.linesStream!;
  }

  wait(): Promise<this> {
    return Promise.resolve(this);
  }

  async toBytes() {
    const bytes = await readAll(this.fsFile);
    Deno.close(this.fsFile.rid);
    return bytes;
  }

  async toString() {
    return new TextDecoder().decode(await this.toBytes());
  }

  toByteReadableStream() {
    return this.fsFile.readable;
  }

  toStringReadableStream() {
    return this.toByteReadableStream().pipeThrough(new TextDecoderStream());
  }

  async toFile(file: Deno.FsFile | string): Promise<void> {
    let fsFile;
    if (typeof file === "string") {
      fsFile = await Deno.create(file);
    } else {
      fsFile = file;
    }
    await this.fsFile.readable.pipeTo(fsFile.writable);
  }
}
