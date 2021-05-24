/**
 * @deprecated
 */
export type IndexCardColorTypes = "white" | "red" | "blue" | "green" | "yellow";

/**
 * @deprecated
 */
export enum IndexCardColorTypeEnum {
  white = "white",
  red = "red",
  blue = "blue",
  green = "green",
  yellow = "yellow",
}

export const IndexCardColor: Record<IndexCardColorTypes, string> = {
  white: "#fff",
  red: "#ffecec",
  blue: "#e9fcff",
  green: "#e8ffef",
  yellow: "#fffddb",
} as const;
