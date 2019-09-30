import { addParameters, configure } from "@storybook/react";
import { characterCardStories } from "./stories/components/characterCardStories";
import { sceneStories } from "./stories/pages/sceneStories";

addParameters({
  options: {
    panelPosition: "right"
  }
});

configure(() => {
  loadStoriesInAlphabeticalOrder();
}, module);

function loadStoriesInAlphabeticalOrder() {
  sceneStories();
  characterCardStories();
}
