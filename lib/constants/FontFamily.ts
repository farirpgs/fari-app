export const FontFamily = {
  Default: font(["Inter", "HelveticaNeue", "Helvetica", "Arial", "sans-serif"]),
  Console: font(["Consolas", "Liberation Mono", "Menlo", "monospace"]),
  Fate: font(["fate"]),
  HandWriting: font(["Virgil", "cursive"]),
} as const;

function font(fonts: Array<string>) {
  return fonts.join(",");
}
