interface Colors {
  chip: string;
  dark: string;
  light: string;
}

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

/**
 * @deprecated
 */
export const IndexCardColor: Record<IndexCardColorTypes, Colors> = {
  white: {
    chip: "#ffffff",
    dark: "#424242",
    light: "#fff",
  },
  red: {
    chip: "#ff0000",
    dark: "#390e0f",
    light: "#ffecec",
  },
  blue: {
    chip: "#00daff",
    dark: "#0f333a",
    light: "#e9fcff",
  },
  green: {
    chip: "#00ff4c",
    dark: "#103d1d",
    light: "#e8ffef",
  },
  yellow: {
    chip: "#ffee00",
    dark: "#664b00",
    light: "#fffddb",
  },
} as const;
