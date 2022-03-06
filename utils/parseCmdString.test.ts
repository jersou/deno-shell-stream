import { assertEquals } from "../deps.ts";
import { parseCmdString } from "./parseCmdString.ts";

Deno.test("parseCmdString", () => {
  assertEquals(parseCmdString(["echo", "aa", "bb"]), ["echo", "aa", "bb"]);
  assertEquals(parseCmdString("echo aa bb"), ["echo", "aa", "bb"]);
  assertEquals(parseCmdString(`echo 'aa bb' "cc dd"`), [
    "echo",
    "aa bb",
    "cc dd",
  ]);
  assertEquals(parseCmdString("echo 'aa \"c c\" bb'"), ["echo", 'aa "c c" bb']);
  assertEquals(parseCmdString(`echo "'aa'"`), ["echo", "'aa'"]);
  assertEquals(parseCmdString(`echo '"aa"'`), ["echo", '"aa"']);
  assertEquals(parseCmdString(`echo "''"`), ["echo", "''"]);
  assertEquals(parseCmdString(`echo '""'`), ["echo", '""']);
});
