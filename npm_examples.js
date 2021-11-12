const shstr = require("./npm/umd/mod.js");

shstr.FromArray(["line1", "line2"]).log().close();
shstr.FromRun("echo toto").log().close();
