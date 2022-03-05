import { build } from "https://deno.land/x/dnt@0.21.1/mod.ts";

await build({
  shims: {
    deno: true,
  },
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  typeCheck: false, // TODO remove
  package: {
    // package.json properties
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
await Deno.copyFile("./npm_examples.js", "./npm/examples.js");
