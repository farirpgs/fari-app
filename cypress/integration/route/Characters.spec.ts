import { Fari } from "lib/util/Fari";

describe("Characters", () => {
  it("should support managing characters", () => {
    Fari.start();
    cy.visit("/");

    Fari.get("page.menu.characters").click();
    Fari.get("manager.new").click();

    Fari.get("character-dialog.name").type("Luke Skywalker");

    Fari.get("character-dialog.save")
      .invoke("attr", "data-cy-dirty")
      .should("eq", "true");

    Fari.get("character-dialog.save").click();
    Fari.get("page.menu.play").click();

    Fari.get("page.menu.characters").click();
    cy.contains("Luke Skywalker").click();
  });
});
