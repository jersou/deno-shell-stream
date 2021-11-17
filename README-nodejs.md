# Node ShellStream : [sh-stream NPM package](https://www.npmjs.com/package/sh-stream)

ShellStream mix I/O stream API and Shell pipe/redirects.

It has zero 3rd party dependencies and don't internally run sh or bash commands.

This package is the Node version of The deno ShellStream lib, build in Node by
[dnt](https://github.com/denoland/dnt).

## Quick examples (with NodeJS)

Install from npm : `npm install sh-stream`

```javascript
const { FromFile, FromRun } = require("sh-stream");

(async function () {
  let res = await FromRun("cat /etc/passwd").run("grep /root").toString();
  console.log(res); // → root:x:0:0:root:/root:/bin/bash

  // the same example without run cat & grep command :
  res = await FromFile("/etc/passwd")
    .grep(/\/root/) // keep lines that contain /root
    .log() // → log "root:x:0:0:root:/root:/bin/bash"
    .toString();
  console.log(res); // → res = "root:x:0:0:root:/root:/bin/bash"

  res = await FromRun("node -h").head(1).toString();
  console.log(res); // → Usage: node [options] [ script.js ] [arguments]

  console.log(await FromRun(["node", "-h"]).tail(2).toArray());
  // → [ '', 'Documentation can be found at https://nodejs.org/' ]

  // exit codes of processes can be retrieved :
  const closeRes = await FromRun([
    "node",
    "eval",
    'console.log("foo"); process.exit(13)',
  ])
    .run("cat")
    .run("cat")
    .close();
  const exitCodes = closeRes.statuses.map((s) => s?.code);
  console.log(
    `success=${closeRes.success} codes=${exitCodes} out=${closeRes.out}`,
  );
  // → "success=false codes=13,0,0 out=foo"
})();
```

See more examples in `example.js` file.

## Operators

The usage :
`res = await Startpoint(...).Operator(...).Operator(...).Endpoint(...)`

All startpoints and operators return a ShellStream, the endpoints return a
promise. ShellStream contains all operators as method, the IDEs can
autocomplete/check the code.

### Startpoint Operators

These operators return a ShellStream :

- `FromRun(cmd: string[] | string, opt?:` [RunOptions](#RunOptions) `)` →
  generate a stream from each line of the stdout of the process. If cmd is a
  string, it will be parsed to array.
- `FromFile(path: string, opt?: { closeBeforeStreaming?: boolean })` → generate
  a stream from each line of the file.
- `FromArray(lines: string[])` → generate a stream from each element of the
  array.
- `FromString(line: string)` → generate a stream from line.
- `FromDir(path: string)` → generate a stream of file name from dir.
- `FromWalk(path: string, opt?: WalkOptions)` → generate a stream of file path
  from dir, using [walk](https://deno.land/std/fs#walk), see
  [WalkOptions](https://doc.deno.land/https/deno.land/std@0.114.0/fs/walk.ts#WalkOptions).
- Pipe: [see bellow "Pipe chapter"](#Pipe).

The startpoint are also available from static method of ShellStream :

```typescript
ShellStream.fromRun(cmd: string[] | string, opt?: RunOptions);
ShellStream.fromFile(path: string, opt?: { closeBeforeStreaming?: boolean });
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
  the part ordered by indexes, split the line by `delim`.
- `filter(filterFunction: FilterFunction)` : transform the stream, keep only
  lines that return true in filterFunction.
- `grep(regex: RegExp | string, opt?: {onlyMatching?: boolean})` : transform the
  stream, keep only lines that match the regex. If `opt.onlyMatching === true`,
  the stream is then all results matching the complete regex, like `grep -o`
  Linux command.
- `head(count = 1)` : transform the stream, keep only first `count` lines.
- `tail(count = 1)` :transform the stream, keep only last `count` lines.
- `sponge()` : keep stream unchanged, soaks up all its input before re-emit all.
- `sort()` : transform the stream, sort the stream.
- `uniq()` : transform the stream, keep only lines that are different from
  previous line.
- `grepo(regex: RegExp | string)`: alias of grep() with opt :
  `{ onlyMatching: true }`.
- `pipe(...operators: OperatorFunc[])` : [see bellow "Pipe chapter"](#Pipe).

### Endpoint Operators

All these operators close the stream and return a Promise :

- `toString():Promise<string>` : the stream is closed and converted to String.
- `toArray():Promise<string[]>` : the stream is closed and converted to Array.
- `toFile(outputPath: string):Promise<CloseRes>` : the stream is closed and
  write to the `converted` file.
- `close(opt?: CloseOptions = { processes: "AWAIT" }):Promise<CloseRes>` : close
  all ressources and wait end of operators (includes processes end)
- `success():Promise<boolean>` : the stream is closed and `CloseRes.success` is
  returned
- `toIterable():AsyncIterable<string>` : return the iterable of the stream. The
  stream is closed at end of the iterable.

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

Extends [Deno.RunOptions](https://doc.deno.land/builtin/stable#Deno.RunOptions)

```
export type RunOptions = Omit<Deno.RunOptions, "cmd"> & {
  throwIfRunFail?: boolean;
  exitCodeIfRunFail?: number;
  streamStdErr?: boolean;
};
```

- throwIfRunFail: if the process exit code !== 0, throw error
- exitCodeIfRunFail: if the process exit code !== 0, immediately exit
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
