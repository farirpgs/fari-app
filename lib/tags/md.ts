import marked from "marked";

export function md(strings: TemplateStringsArray, ...args: Array<any>): string {
  const raw = strings.raw[0];

  return marked(raw);
}
