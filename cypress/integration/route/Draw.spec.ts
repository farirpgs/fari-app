import { Fari } from "lib/util/Fari";

// "#000000",
// "#e69f00",
// "#56b4e9",
// "#019e73",
// "#f0e442",
// "#0072b2",
// "#d55e01",
// "#cc79a7",

describe("/draw", () => {
  describe("Given I want to draw my zones", () => {
    it("should draw my zones", () => {
      Fari.start();

      cy.visit("/draw");
      Fari.get("draw.palette").click();

      cy.get(`.data-cy-color-picker [title="#e69f00"]`).click();

      draw();

      Fari.get("draw.undo").click();
      Fari.get("draw.rectangle").click();
      draw();

      Fari.get("draw.undo").click();
      Fari.get("draw.ellipse").click();
      draw();

      Fari.get("draw.undo").click();
      Fari.get("draw.token").click();

      for (let i = 0; i <= 8; i++) {
        Fari.get("draw.container").trigger("pointerdown", {
          button: 0,
          pointerId: 1,
          clientX: 492 + i * 8,
          clientY: 217 + i * 8,
        });
      }

      Fari.get("draw.clear").click();
    });
  });
});

function draw() {
  Fari.get("draw.container")
    .trigger("pointerdown", {
      button: 0,
      pointerId: 1,
      clientX: 492,
      clientY: 217,
    })
    .trigger("pointermove", {
      button: 0,
      clientX: 600,
      clientY: 300,
    })
    .trigger("pointerup", {
      button: 0,
      pointerId: 1,
    });
}
