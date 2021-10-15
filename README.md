# Deno ShellStream

ShellStream is a lib for Deno that mix I/O stream API and Shell pipe/redirects.

It has zero 3rd party dependencies and don't internally run sh or bash commands.

## Quick exemples

```typescript
import { FromRun, FromFile } from "https://deno.land/x/shell_stream@v0.1.0/mod.ts";
import { bgBlue } from "https://deno.land/std@0.110.0/fmt/colors.ts";

let res = await FromRun("cat /etc/passwd").run("grep /root").toString();
console.log(res); // → root:x:0:0:root:/root:/bin/bash

// the same example without run cat & grep command :
res = await FromFile("/etc/passwd")
  .log(bgBlue) // → log the entire file with blue background
  .grep(/\/root/) // keep lines that contain /root
  .log() // → log "root:x:0:0:root:/root:/bin/bash"
  .toString();
console.log(res); // → res = "root:x:0:0:root:/root:/bin/bash"

res = await FromRun("deno --version").head(1).toString();
console.log(res); // → deno 1.15.1 (release, x86_64-unknown-linux-gnu)

console.log(await FromRun(["deno", "--version"]).tail(2).toArray());
// → ["v8 9.5.172.19", "typescript 4.4.2"]
```

See more examples in `example.ts` file.

## Operators

The usage :
`res = await Startpoint(...).Operator(...).Operator(...).Endpoint(...)`

All startpoints and operators return a ShellStream, the endpoints return a
promise. ShellStream contains all operators as method, the IDEs can
autocomplete/check the code.

### Startpoint Operators

These operators return a ShellStream :

- `FromRun(cmd: string[] | string, opt?:` [RunOptions](#RunOptions) `)` →
  generate a stream with each line of the stdout of the process. If cmd is a
  string, it will be parsed to array.
- `FromFile(path: string)` → generate a stream with each line of the file.
- `FromArray(lines: string[])` → generate a stream with each element of the
  array.
- Pipe: [see bellow "Pipe chapter"](#Pipe)

The startpoint are also available from static method of ShellStream :

```typescript
ShellStream.fromRun(cmd: string[] | string, opt?: RunOptions);
ShellStream.fromFile(path: string);
ShellStream.fromArray(lines: string[]);
ShellStream.pipe(...operators: OperatorFunc[]);
```

### Intermediate Operators

These operators return a ShellStream :

- `run(cmd: string[] | string, opt?:` [RunOptions](#RunOptions) `)` : generate a
  stream with each line of the stdout of the process. The current stream is
  passed to the stdin of the process. If cmd is a string, it will be parsed to
  array (regex used to split : `/"(\\"|[^"])*"|'(\\'|[^'])*'|[^ "']*/g`).
- `tap(tapFunction: TapFunction)` : keep stream unchanged, run the `tapFunction`
  with the current line as argument.
- `tee(outputPath: string)` : keep stream unchanged, write the stream in the
  `outputPath` file.
- `log(transform?: LogTransformFunction)` : keep stream unchanged, log each
  lines in console.
- logWithTimestamp : keep stream unchanged, log each lines in console with the
  date (ISOString) at the beginning.
- `map(mapFunction: MapFunction)` : transform the stream with the return of
  mapFunction, the current line is passed as the first argument to the
  mapFunction.
- `timestamp()` : transform the stream with the date (ISOString) at the
  begining.
- `replace(v: string | RegExp, r: Replacer)` : transform the stream with the
  replace result.
- `cut(delim: string, indexes: number[], sep = " ")` : transform the stream with
  the part ordered by indexes, split the line by `sep`.
- `filter(filterFunction: FilterFunction)` : transform the stream, keep only
  lines that return true in filterFunction.
- `grep(regex: RegExp)` : transform the stream, keep only lines that match the
  regex.
- `head(count = 1)` : transform the stream, keep only first `count` lines.
- `tail(count = 1)` :transform the stream, keep only last `count` lines.
- `pipe(...operators: OperatorFunc[])` : [see bellow "Pipe chapter"](#Pipe).

### Endpoint Operators

All these operators close the stream and return a Promise :

- `toString():Promise<string>` : the stream is closed and converted to String.
- `toArray():Promise<string[]>` : the stream is closed and converted to Array.
- `toFile(outputPath: string):Promise<CloseRes>` : the stream is closed and
  write to the `converted` file.
- `close(opt?: CloseOptions = { processes: "AWAIT" }):Promise<CloseRes>` : close
  all ressources and wait end of operators (includes processes end)

```typescript
export type CloseRes = {
  success: boolean;
  statuses: ((Deno.ProcessStatus & { cmd: string[] }) | undefined)[];
  out: string[];
};
```

- success : true if all processes run from the startpoint are in success status
- statuses: array of status of all operators from startpoint
- out: array of the output stream

## RunOptions

```
export type RunOptions = {
  throwIfRunFail?: boolean;
  exitCodeIfRunFail?: number;
  streamStdErr?: boolean;
  stdout?: "inherit" | "piped" | "null" | number;
  stderr?: "inherit" | "piped" | "null" | number;
};
```

- throwIfRunFail: if the process exit code !== 0, throw error
- exitCodeIfRunFail: if the process exit code !== 0, immediately exit from Deno
- streamStdErr: stream stderr of the process instead of the stdout
- stdout: Deno.run option, unused if streamStdErr !== true
- stderr: Deno.run option, unused if streamStdErr === true

## Pipe

Pipe(...operators: OperatorFunc[])

An alternative "pipe" API is possible. The "call chain" version :

```typescript
await FromArray(["1", "2", "3"])
  .filter((l) => parseInt(l) > 1) // keep ["2", "3"]
  .run("wc -l") // "wc -l" count input lines
  .log() // log "2"
  .close();
```

The "pipe" API version :

```typescript
await Pipe(
  fromArray(["1", "2", "3"]),
  filter((l: string) => parseInt(l) > 1), // keep ["2", "3"],
  run("wc -l"), // "wc -l" count input lines
  log(), // log "2"
).close();
```

Pipe is also available from ShellStream Class :

```typescript
await FromArray(["1", "2", "3"])
  .filter((l) => parseInt(l) > 1) // keep ["2", "3"]
  .pipe(
    run("wc -l"), // "wc -l" count input lines
    log(), // log "2"
  )
  .close();
```

## Deno API only equivalents

```typescript
await FromRun("cat /etc/passwd").grep(/\/root/).toString();
```

is equivalent to :

```typescript
const process = Deno.run({
  cmd: ["cat", "/etc/passwd"],
  stdout: "piped",
});
res = new TextDecoder()
  .decode(await process.output())
  .split("\n")
  .filter((line) => line.match(/\/root/))
  .join("\n");
process.close();
console.log(res); // → root:x:0:0:root:/root:/bin/bash
```

---

```typescript
await FromRun("cat /etc/passwd").run("grep /root").toString();
```

is equivalent to :

```typescript
const process1 = Deno.run({ cmd: ["cat", "/etc/passwd"], stdout: "piped" });
const process2 = Deno.run({
  cmd: ["grep", "/root"],
  stdin: "piped",
  stdout: "piped",
});
// copy() get stuck if the process1.stdout is not closed
(async () => {
  await process1.status();
  process1.stdout!.close();
  process1.close();
})();
try {
  await copy(process1.stdout!, process2.stdin!);
} catch (_) {
  // process1.stdout.close() generate BadResource exception in copy()
}
process2.stdin!.close();
res = new TextDecoder().decode(await process2.output());
process2.close();
console.log(res); // → root:x:0:0:root:/root:/bin/bash
```

**Warning** : ShellStream streams line by line, and the performances is then
reduced. The behavior can probably be different from shell pipes, especially if
the stream is not text.

## Development

The folder `.DENO_DIR` and `.lock.json` are **not** necessary for the project to
work, it just allows to save its dependencies.

Some dev command are listed in the scripts.yaml file, this file can be use with
[Velociraptor](https://velociraptor.run/docs/installation/) :

- test: launch tests
- test-watch: launch tests on file change
- lint: lint the code
- fmt: format the code
- bundle: bundle the project and its dependencies to dist/shell_stream.js
- bak-dep: backup the dependencies to `.DENO_DIR` and update `.lock.json`
- gen-cov: generate the test coverage

The `sanitize` function from `sanitize.ts` check if all ressource and ops are\
closed/completed.
