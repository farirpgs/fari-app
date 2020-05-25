import { addParameters, configure } from "@storybook/react";

addParameters({
  options: {
    panelPosition: "right",
  },
});

configure(() => {
  loadStoriesInAlphabeticalOrder();
}, module);

function loadStoriesInAlphabeticalOrder() {}
