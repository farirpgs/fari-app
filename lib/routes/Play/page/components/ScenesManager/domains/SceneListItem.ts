export const SceneListItem = {
  formatDate(timestamp: number) {
    if (!timestamp) {
      return "";
    }
    try {
      const options: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "numeric",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      const formattedDate = new Date(timestamp).toLocaleDateString(
        undefined,
        options
      );
      return formattedDate;
    } catch (error) {
      return new Date(timestamp).toString();
    }
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
    const [firstWord, secondWord] = str.split(" ");

    if (firstWord && secondWord) {
      return firstWord[0] + secondWord[0];
    }
    return firstWord[0];
  },
};
