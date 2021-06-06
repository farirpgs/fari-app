import { Fari } from "lib/util/Fari";

describe("/dice", () => {
  it("Should roll dice", () => {
    Fari.start();

    Fari.get("page.menu.tools").click({ force: true });
    Fari.get("page.menu.tools.dice").click();

    setAliases();

    isRolling();
    hasRolled();

    roll();

    isRolling();
    hasRolled();
  });

  function isRolling() {
    cy.get("@dice").then((e) => {
      const isRolling = e.attr("data-cy-rolling");
      expect(isRolling).eq("true");
    });
  }

  function setAliases() {
    Fari.get("dice").as("dice").click();
  }

  function roll() {
    cy.get("@dice").click();
  }

  function hasRolled() {
    cy.get("@dice").invoke("attr", "data-cy-rolling").should("eq", "false");
    cy.get("@dice")
      .invoke("attr", "data-cy-value")
      .should("be.oneOf", [
        "-4",
        "-3",
        "-2",
        "-1",
        "0",
        "+1",
        "+2",
        "+3",
        "+4",
      ]);
  }
});
