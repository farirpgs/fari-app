export const Font = {
  lineHeight(fontSizeRem: number) {
    if (!fontSizeRem) {
      return "1rem";
    }
    return `${fontSizeRem * 1.5}rem`;
  },
};
