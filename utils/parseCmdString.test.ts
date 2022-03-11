import { assertEquals } from "../deps.ts";
import { parseCmdString } from "./parseCmdString.ts";

Deno.test("parseCmdString", () => {
  assertEquals(
    parseCmdString(
      ["echo", "aa", "bb"],
    ),
    ["echo", "aa", "bb"],
  );
  assertEquals(
    parseCmdString("echo aa bb"),
    ["echo", "aa", "bb"],
  );
  assertEquals(
    parseCmdString(`echo 'aa bb' "cc dd"`),
    ["echo", "aa bb", "cc dd"],
  );
  assertEquals(
    parseCmdString(`echo 'aa "c c" bb'`),
    ["echo", 'aa "c c" bb'],
  );
  assertEquals(
    parseCmdString(`echo "'aa'"`),
    ["echo", "'aa'"],
  );
  assertEquals(
    parseCmdString(`echo '"aa"'`),
    ["echo", '"aa"'],
  );
  assertEquals(
    parseCmdString(`echo "''"`),
    ["echo", "''"],
  );
  assertEquals(
    parseCmdString(
      `echo '""'`,
    ),
    ["echo", '""'],
  );
  assertEquals(
    parseCmdString(`deno test -A --ignore="vendor,npm"`),
    ["deno", "test", "-A", '--ignore="vendor,npm"'],
  );
  assertEquals(
    parseCmdString(`aa "bb cc"="dd ee"`),
    ["aa", `"bb cc"="dd ee"`],
  );
  assertEquals(
    parseCmdString(`aa bb cc"dd ee`),
    ["aa", "bb", "cc", "dd", "ee"],
  );
  assertEquals(
    parseCmdString(`aa bb cc "dd ee`),
    ["aa", "bb", "cc", "dd", "ee"],
  );
  assertEquals(
    parseCmdString(`aa b cc d "e" f`),
    ["aa", "b", "cc", "d", "e", "f"],
  );
  assertEquals(
    parseCmdString(`aa a"bb cc "d e`),
    ["aa", 'a"bb cc "d', "e"],
  );
});
