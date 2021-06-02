// export const IndexCardColor: Record<IndexCardColorTypes, string> = {
//   white: "#fff",
//   red: "#ffecec",
//   blue: "#e9fcff",
//   green: "#e8ffef",
//   yellow: "#fffddb",
// } as const;

// export const IndexCardColor ={
//   white: "#fff",
//   red: "#f28a82",
//   blue: "#cbf0f8",
//   green: "#ccff90",
//   yellow: "#fff475",
// } as const;
export const IndexCardColor = {
  white: "#fff",
  red: "#f28b82",
  orange: "#fbbc04",
  yellow: "#fff475",
  green: "#ccff90",
  teal: "#a7ffeb",
  blue: "#cbf0f8",
  darkBlue: "#aecbfa",
  purple: "#d7aefb",
  pink: "#fdcfe8",
  brown: "#e6c9a8",
  grey: "#e8eaed",
} as const;

export type IndexCardColorTypes = keyof typeof IndexCardColor;
