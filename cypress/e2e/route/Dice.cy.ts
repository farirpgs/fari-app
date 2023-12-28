import { Fari } from "lib/util/Fari";

describe("/dice", () => {
  it("Should roll dice", () => {
    Fari.start();
    Fari.get("page.menu.tools").click({ force: true });
    Fari.get("page.menu.tools.dice").click({ force: true });
    cy.get("body").click({ force: true });
    Fari.get("dice-buttons.1d4").click({ force: true });
    Fari.get("dice-buttons.1d6").click({ force: true });
    Fari.get("dice-buttons.1d8").click({ force: true });
    Fari.get("dice-buttons.1d10").click({ force: true });
    Fari.get("dice-buttons.1d12").click({ force: true });
    Fari.get("dice-buttons.1d20").click({ force: true });
    Fari.get("dice-buttons.1d100").click({ force: true });
  });
});
