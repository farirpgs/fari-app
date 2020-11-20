import { Fari } from "lib/util/Fari";

describe("/", () => {
  it("should load the home page", () => {
    Fari.start();
    // cy.screenshot();
  });

  describe("Given I want to change my theme", () => {
    it("should let me use the dark theme", () => {
      Fari.start();
      Fari.toggleDarkMode();
    });
  });
  describe("Given I want to change my language", () => {
    it("should let me pick my language", () => {
      Fari.start();

      Fari.changeLanguage("fr");

      cy.contains("Bienvenue sur Fari");
      Fari.get("page.menu.dice").click();

      cy.contains("Appuyez sur le bouton pour relancer");
    });
  });
});
