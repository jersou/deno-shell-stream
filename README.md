# Deno ShellStream

ShellStream is a lib for Deno that mix I/O stream API and Shell pipe/redirects.

It has zero 3rd party dependencies and don't internally run sh or bash commands.


---- TODO ----


## Quick examples


---- TODO ----

See more examples in `example.ts` file.


## Deno API only equivalents

---- TODO ----


## Development

The folder `vendor` are **not** necessary for the project to
work, it just allows to save its dependencies.

Some dev command are listed in the scripts.yaml file, this file can be use with
[Velociraptor](https://velociraptor.run/docs/installation/) :

- test: launch tests
- test-watch: launch tests on file change
- lint: lint the code
- fmt: format the code
- bundle: bundle the project and its dependencies to dist/shell_stream.js
- build-npm
- vendor: backup the dependencies to `vendor/`
- gen-cov: generate the test coverage
- pre-commit
