import { ShellStream } from "../shell_stream.ts";
import { StartOperator } from "../types.ts";
import { fetchUrl } from "../operators/fetch.ts";

export const fromFetch: StartOperator = (url: string, init?: RequestInit) =>
  () => fetchUrl(url, init)(ShellStream.empty());
