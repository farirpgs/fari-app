import { addParameters, configure } from "@storybook/react";
import { gameStories } from "./stories/pages/gamesStories";

addParameters({
  options: {
    panelPosition: "right",
  },
});

configure(() => {
  loadStoriesInAlphabeticalOrder();
}, module);

function loadStoriesInAlphabeticalOrder() {
  gameStories();
}
