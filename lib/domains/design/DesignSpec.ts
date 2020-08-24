export const DesignSpec = {
  spacing: {
    1: "4px",
    2: "8px",
    3: "16px",
    4: "32px",
    5: "40px",
    6: "64px",
  },
  background: {
    default: "#F4F4F4",
    surface: "#FFFFFF",
  },
  elevations: {
    section:
      "0px 6px 20px rgba(0, 0, 0, 0.16), 0px 2px 24px rgba(0, 0, 0, 0.02)",
    sectionBottom:
      "rgba(0, 0, 0, 0.16) 0 20px 20px, rgba(0, 0, 0, 0.02) 0px 2px 24px",
    card: "0px 4px 10px rgba(0, 0, 0, 0.1), 0px 2px 14px rgba(0, 0, 0, 0.05)",
  },
  utilityColors: {
    success: {
      color: "#FFFFFF",
      background: "#308000",
    },
    successLight: {
      color: "rgba(0, 0, 0, 0.87)",
      background: "#E1E9DD",
    },
    warning: {
      color: "rgba(0, 0, 0, 0.87)",
      background: "#FFB800",
    },
    error: {
      color: "#FFFFFF",
      background: "#B00020",
    },
    lightGray: {
      color: "rgba(0, 0, 0, 0.87)",
      background: "#E0E0E0",
    },
  },
  textColors: {
    onLight: {
      high: "rgba(0, 0, 0, 0.87)",
      medium: "rgba(0, 0, 0, 0.60)",
      disabled: "rgba(0, 0, 0, 0.38)",
    },
    onDark: {
      high: "rgba(255, 255, 255, 1)",
      medium: "rgba(255, 255, 255, 0.74)",
      disabled: "rgba(255, 255, 255, 0.38)",
    },
  },
  outline: "rgba(0, 0, 0, 0.12)",
} as const;
