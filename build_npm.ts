import { build } from "https://deno.land/x/dnt@0.21.1/mod.ts";
import { copy } from "https://deno.land/std@0.158.0/fs/copy.ts";
import { Stream } from "./Stream.ts";

await Stream.fromRun(["bash", "-c", "type node"]).wait();

await copy("./test-data", "./npm/script/test-data", { overwrite: true });

await build({
  shims: {
    deno: true,
    undici: true,
    timers: true,
    custom: [{
      package: { name: "stream/web" },
      globalNames: [
        "ReadableStream",
        "WritableStream",
        "TransformStream",
        "TextDecoderStream",
      ],
    }],
  },
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  typeCheck: false,
  test: true,
  package: {
    name: "sh-stream",
    version: "1.0.0",
    description: "Mix I/O stream API and Shell pipe/redirects",
    license: "MIT",
    repository: {
      type: "git",
      url: "git@github.com:jersou/deno-shell-stream.git",
    },
    bugs: {
      url: "https://github.com/jersou/deno-shell-stream/issues",
    },
  },
});

await Deno.copyFile("./README-nodejs.md", "./npm/README.md");
