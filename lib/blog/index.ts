import fs from "fs";
import path from "path";

export const blogPosts: Array<{
  title: string;
  slug: string;
  date: string;
  load: () => any;
}> = [
  {
    title:
      "New Fari Release v3.3.5 | The One With the Oracle, a New User interfaces and Performance Enhancements.",
    slug: "2020-12-07-fari-3-3-5-oracle.md",
    date: "2020-12-07",
    load: async () => {
      return fs.readFileSync(
        path.join(__dirname, "./posts/2020-12-07-fari-3-3-5-oracle.md"),
        "utf8"
      );
    },
  },
  {
    title: "Fari v3.3.0 - The one with groups, skill rolls and Patreon",
    slug: "2020-11-10-fari-3-3-0-groups-roll-skills",
    date: "2020-11-10",
    load: async () => {
      return fs.readFileSync(
        path.join(
          __dirname,
          "./posts/2020-11-10-fari-3-3-0-groups-roll-skills.md"
        ),
        "utf8"
      );
    },
  },
  {
    title: "New Drawing Area in Fari v3.2.0",
    slug: "2020-10-19-fari-3-2-0-drawing-area",
    date: "2020-10-16",
    load: async () => {
      return fs.readFileSync(
        path.join(__dirname, "./posts/2020-10-19-fari-3-2-0-drawing-area.md"),
        "utf8"
      );
    },
  },
];
