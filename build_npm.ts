import { build } from "https://deno.land/x/dnt@0.6.0/mod.ts";

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  typeCheck: false, // TODO remove
  package: {
    // package.json properties
    name: "shell-stream",
    version: "0.1.10",
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
