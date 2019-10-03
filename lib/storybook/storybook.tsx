import { addParameters, configure } from "@storybook/react";
import { characterCardStories } from "./stories/components/characterCardStories";
import { sceneStories } from "./stories/pages/sceneStories";
import { gameStories } from "./stories/pages/gamesStories";

addParameters({
  options: {
    panelPosition: "right"
  }
});

configure(() => {
  loadStoriesInAlphabeticalOrder();
}, module);

function loadStoriesInAlphabeticalOrder() {
  gameStories();
  sceneStories();
  characterCardStories();
}
