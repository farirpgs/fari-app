import { getDayJSFrom } from "../../../domains/dayjs/getDayJS";

export const listItem = {
  formatDate(timestamp: number) {
    if (!timestamp) {
      return "";
    }
    const date = getDayJSFrom(timestamp);
    return date.format("lll");
  },

  getColor(str: string) {
    if (!str) {
      return "#000000";
    }
    let hash = 0;
    let i;

    for (i = 0; i < str.length; i += 1) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let colour = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      colour += `00${value.toString(16)}`.substr(-2);
    }

    return colour;
  },

  getAbreviation(str: string) {
    if (!str) {
      return "";
    }
    const [firstWord] = str.split(" ");

    return firstWord[0];
  },
};
