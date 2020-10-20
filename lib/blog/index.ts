export const blogPosts = [
  {
    title: "New Drawing Area in Fari v3.2.0",
    slug: "2020-10-19-fari-3-2-0-drawing-area",
    date: "2020-10-16",
    load: () => {
      return import("./posts/2020-10-19-fari-3-2-0-drawing-area.md");
    },
  },
];
