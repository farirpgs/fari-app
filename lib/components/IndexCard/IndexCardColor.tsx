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

export const DiceLabelsColors = [
  // IndexCardColor.blue,
  IndexCardColor.white,
  IndexCardColor.red,
  IndexCardColor.orange,
  IndexCardColor.blue,
  IndexCardColor.yellow,
  IndexCardColor.green,
  IndexCardColor.teal,
  IndexCardColor.darkBlue,
  IndexCardColor.purple,
  IndexCardColor.pink,
  IndexCardColor.brown,
  IndexCardColor.grey,
];

export type IndexCardColorTypes = keyof typeof IndexCardColor;
