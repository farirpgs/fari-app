export const FontFamily = {
  Default: font(["Inter", "HelveticaNeue", "Helvetica", "Arial", "sans-serif"]),
  Console: font(["Consolas", "Liberation Mono", "Menlo", "monospace"]),
  Fate: font(["fate"]),
  // PatrickHand: font(["Patrick Hand"]),
  // HandWriting: font(["Caveat Brush", "cursive"]),
  // HandWriting: font(["Architects Daughter", "cursive"]),
  // HandWriting: font(["Kalam", "cursive"]),
  HandWriting: font(["Caveat", "cursive"]),
} as const;

function font(fonts: Array<string>) {
  return fonts.join(",");
}
