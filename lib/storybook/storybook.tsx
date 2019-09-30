import {
  addDecorator,
  addParameters,
  configure,
  storiesOf
} from "@storybook/react";
import React from "react";

addParameters({
  options: {
    panelPosition: "right"
  }
});

configure(() => {
  loadStoriesInAlphabeticalOrder();
}, module);

function loadStoriesInAlphabeticalOrder() {
  storiesOf("Pages | Scene", module)
    // .addDecorator(withKnobs)
    .add("Basic", () => {
      return <h1>ALLO</h1>;
    });
}
