import { Fari } from "lib/util/Fari";

describe("/scenes", () => {
  describe("Given I want to create a scene", () => {
    it("should support adding, filling up and removing a scene", () => {
      Fari.start();
      cy.visit("/");

      // new scene
      Fari.get("page.menu.my-binder").click({ force: true });
      Fari.get("my-binder.folders.scenes").click();
      Fari.get("my-binder.folders.scenes.new").click();

      // set fields
      Fari.get("scene.name").type("Ba Sing Se");
      Fari.get("scene.group").type("Avatar");

      Fari.get("scene.card-collections").select("Fate");

      Fari.get("scene.add-card.select").click();
      Fari.get("scene.add-card.select.ASPECT").click({ force: true });

      Fari.get("scene.add-card.select").click();
      Fari.get("scene.add-card.select.BOOST").click({ force: true });

      Fari.get("scene.add-card.select").click();
      Fari.get("scene.add-card.select.NPC").click({ force: true });

      Fari.get("scene.add-card.select").click();
      Fari.get("scene.add-card.select.BAD GUY").click({ force: true });

      Fari.get("scene.add-card.select").click();
      Fari.get("scene.add-card.select.CARD").click({ force: true });

      // aspect
      Fari.get("scene.aspect.0.title").type("Something weird is going on");
      Fari.get("scene.aspect.0.content").type("There is no war in Ba Sing Se");

      // remove second
      // Fari.get("scene.aspect.1.reset").click({ force: true });
      Fari.get("scene.aspect.1.remove").click({ force: true });

      // initiative
      Fari.get("scene.aspect.1.initiative").click({ force: true });
      Fari.get("scene.aspect.2.initiative").click({ force: true });
      Fari.get("scene.aspect.2.initiative").click({ force: true });

      // pin
      Fari.get("scene.aspect.1.pin").click({ force: true });

      // save
      Fari.waitContentEditable();
      Fari.get("scene.save").click();
      cy.title().should("eq", "Ba Sing Se | Fari");

      // delete
      Fari.get("page.menu.my-binder").click();
      Fari.get("my-binder.folders.scenes").click();
      Fari.get("my-binder.element.Ba Sing Se.delete").first().click();

      cy.contains("Ba Sing Se").should("not.exist");

      // should be back to home page
      cy.url().should("eq", "http://localhost:1234/");

      // undo
      cy.contains("Undo").click();
      cy.contains("Ba Sing Se").click();

      // new scene
      Fari.get("page.menu.my-binder").click();
      Fari.get("my-binder.folders.scenes").click();
      Fari.get("my-binder.folders.scenes.new").click();

      // add badguy and pin it

      Fari.get("scene.add-card.select").click();
      Fari.get("scene.add-card.select.BAD GUY").click({ force: true });

      Fari.get("scene.aspect.0.title").type("Dai Li");
      Fari.get("scene.aspect.0.pin").click({ force: true });

      // set new field
      Fari.get("scene.name").clear().type("Lower Ring");

      // save
      Fari.waitContentEditable();
      Fari.get("scene.save").click();
      cy.contains("Saved");
      cy.title().should("eq", "Lower Ring | Fari");

      // test menu
      Fari.get("page.menu.my-binder").click();
      Fari.get("my-binder.folders.scenes").click();

      cy.contains("Ba Sing Se");
      cy.contains("Lower Ring");

      // close menu
      Fari.closeDrawer();
    });
  });
});
