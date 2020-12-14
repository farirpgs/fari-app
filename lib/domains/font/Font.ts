export const Font = {
  monospace: "SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace",
  lineHeight(fontSizeRem: number) {
    if (!fontSizeRem) {
      return "1rem";
    }
    return `${fontSizeRem * 1.5}rem`;
  },
};
