export type IndexCardColorTypes = "white" | "red" | "blue" | "green" | "yellow";

export const IndexCardColor: Record<IndexCardColorTypes, string> = {
  white: "#fff",
  red: "#ffecec",
  blue: "#e9fcff",
  green: "#e8ffef",
  yellow: "#fffddb",
} as const;

export const IndexCardColorContrast: Record<IndexCardColorTypes, string> = {
  white: "#dedede",
  red: "#ff0000",
  blue: "#00daff",
  green: "#00ff4c",
  yellow: "#ffee00",
} as const;
