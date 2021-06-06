import { Fari } from "lib/util/Fari";

describe("/", () => {
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

      cy.contains("Commencer une partie en ligne");
      Fari.get("page.menu.tools").click({ force: true });
      Fari.get("page.menu.tools.dice").click();

      cy.contains("Lancer des dés en ligne");
    });
  });
  describe("Given I want to check the privacy policy", () => {
    it("I should see the privacy policy link", () => {
      Fari.startLeaveCookie();
      Fari.get("page.privacy-policy").should("exist");
      Fari.get("cookie-consent.privacy-policy").should("exist");
    });
  });
});
