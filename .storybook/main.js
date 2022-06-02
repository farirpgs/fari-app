const path = require("path");
const toPath = (filePath) => path.join(process.cwd(), filePath);
module.exports = {
  core: {
    builder: "@storybook/builder-vite", // 👈 The builder enabled here.
  },
  typescript: { reactDocgen: "none" },
  staticDirs: ["../public"],
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  // https://mui.com/guides/migration-v4/#storybook-emotion-with-v5
};
