import showdown from "showdown";
const converter = new showdown.Converter();

export function md(strings: TemplateStringsArray, ...args: Array<any>): string {
  const raw = strings.raw[0];

  return converter.makeHtml(raw);
}
