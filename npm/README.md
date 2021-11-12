# Node ShellStream

ShellStream is a lib for Deno that mix I/O stream API and Shell pipe/redirects.

It has zero 3rd party dependencies and don't internally run sh or bash commands.

This folder is the Node version of The lib, build by [dnt](https://github.com/denoland/dnt).

## Usage (with NodeJS)

Install from npm : `npm install sh-stream`

```javascript
const shstr = require("sh-stream");

shstr.FromArray(["line1", "line2"]).log().close();
shstr.FromRun("echo toto").log().close();
```
## API

[see Readme from parent folder](../README.md)
