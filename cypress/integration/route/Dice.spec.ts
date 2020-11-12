describe("Dice Route", () => {
  it("Should roll dice", () => {
    cy.visit("/");
    cy.window().then((w) => {
      w.history.pushState({}, undefined, "/dice");
    });

    cy.get("[data-cy=dice]").as("dice");

    isRolling();
    hasRolled();

    roll();

    isRolling();
    hasRolled();
  });
});

function roll() {
  cy.get("@dice").click();
}

function hasRolled() {
  cy.get("@dice").invoke("attr", "data-cy-rolling").should("eq", "false");
  cy.get("@dice")
    .invoke("attr", "data-cy-value")
    .should("be.oneOf", ["-4", "-3", "-2", "-1", "0", "+1", "+2", "+3", "+4"]);
}

function isRolling() {
  cy.get("[@dice]").then((e) => {
    const isRolling = e.attr("data-cy-rolling");
    expect(isRolling).eq("true");
  });
}
