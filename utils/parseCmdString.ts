export function parseCmdString(cmdOrStr: string[] | string): string[] {
  return cmdOrStr instanceof Array ? cmdOrStr : cmdOrStr
    .trim()
    .match(/"(\\"|[^"])*"|'(\\'|[^'])*'|[^ "']+/g)!
    .map((p) =>
      p.match(/^"((\\"|[^"])*)"$/)
        ? p.replace(/^"((\\"|[^"])*)"$/, "$1")
        : p.match(/^'((\\'|[^'])*)'$/)
        ? p.replace(/^'((\\'|[^'])*)'$/, "$1")
        : p
    );
}
