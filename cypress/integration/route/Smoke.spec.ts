import { Fari } from "lib/util/Fari";

describe("/", () => {
  it("should load the home page", () => {
    Fari.start();
    cy.screenshot();
  });
});
