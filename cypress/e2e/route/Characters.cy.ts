import { Fari } from "lib/util/Fari";

describe("/characters", () => {
  describe("Given I want to create a simple character sheet", () => {
    it("should support adding, filling up and removing a character", () => {
      Fari.start();
      cy.visit("/");

      // new character
      Fari.get("page.menu.my-binder").click({ force: true });
      Fari.get("my-binder.folders.characters").click();
      Fari.get("my-binder.folders.characters.new").click();

      Fari.get("character-dialog.name").clear().type("Luke Skywalker");

      // load fate template
      Fari.get("character-dialog.template-input").click();
      Fari.get("character-dialog.template-input")
        .type("Fate Condensed")
        .type("{enter}");

      // fill up fields
      Fari.get("character-dialog.ASPECTS.HIGH CONCEPT.value").type(
        "The Last Jedi"
      );
      Fari.get("character-dialog.ASPECTS.TROUBLE.value").type(
        "Everything for my friends"
      );
      Fari.get("character-dialog.ASPECTS.RELATIONSHIP.value").type(
        "Leia is my sister"
      );
      Fari.get("character-dialog.ASPECTS.OTHER ASPECT.value")
        .eq(0)
        .type("The Dark side calls to me");
      Fari.get("character-dialog.ASPECTS.OTHER ASPECT.value")
        .eq(1)
        .type("Ben Kenobi thought me everything");

      Fari.get("character-dialog.SKILLS.ACADEMICS.value").type("4");
      Fari.get("character-dialog.SKILLS.ATHLETICS.value").type("3");
      Fari.get("character-dialog.SKILLS.BURGLARY.value").type("3");
      Fari.get("character-dialog.SKILLS.CONTACTS.value").type("2");
      Fari.get("character-dialog.SKILLS.CRAFTS.value").type("2");
      Fari.get("character-dialog.SKILLS.DECEIVE.value").type("2");
      Fari.get("character-dialog.SKILLS.DRIVE.value").type("1");
      Fari.get("character-dialog.SKILLS.EMPATHY.value").type("1");
      Fari.get("character-dialog.SKILLS.FIGHT.value").type("1");
      Fari.get("character-dialog.SKILLS.INVESTIGATE.value").type("1");

      Fari.get("character-dialog.STRESS.PHYSICAL.label").click();
      Fari.get("character-dialog.STRESS.PHYSICAL.box.1.value").click();
      Fari.get("character-dialog.STRESS.MENTAL.box.2.value").click();

      Fari.get("character-dialog.CONSEQUENCES.MILD.value").type("I");
      Fari.get("character-dialog.CONSEQUENCES.MODERATE.value").type("Lost");
      Fari.get("character-dialog.CONSEQUENCES.SEVERE.value").type("An Arm");

      Fari.get("character-dialog.OTHER.NOTES.value").type(
        "A long time ago in a galaxy far, far away...."
      );
      Fari.get("character-dialog.group").find("input").type("Star Wars");

      // save

      cy.title().should("contain", "Fari App | ");
      Fari.waitContentEditable();
      Fari.get("character-dialog.save").click();
      cy.title().should("eq", "Luke Skywalker | Fari");
      cy.contains("Saved");

      // navigate away
      Fari.get("page.menu.home").click({ force: true });

      // re-open sheet
      Fari.get("page.menu.my-binder").click({ force: true });
      Fari.get("my-binder.folders.characters").click();

      cy.contains("Luke Skywalker").click();
      cy.title().should("eq", "Luke Skywalker | Fari");

      // delete
      Fari.get("page.menu.my-binder").click({ force: true });
      Fari.get("my-binder.folders.characters").click();

      Fari.get("my-binder.element.Luke Skywalker.delete")
        .first()
        .click({ force: true });
      cy.contains("Star Wars").should("not.exist");
      cy.contains("Luke Skywalker").should("not.exist");

      // should be back to home page
      cy.url().should("eq", "http://localhost:1234/");

      // undo
      cy.contains("Undo").click();
      cy.contains("Luke Skywalker").click();

      // character card
      Fari.get("page.menu.home").click({ force: true });
      Fari.get("home.play-offline").click();

      // add player
      Fari.get("scene.add-player").click();
      Fari.get(
        "scene.player-row.gm-npc-0.assign-or-open-character-sheet"
      ).click();

      cy.contains("Luke Skywalker").click();
    });
  });

  describe("Given I want a to use blank template", () => {
    it("should let load blank template", () => {
      Fari.start();
      cy.visit("/");

      // new character
      Fari.get("page.menu.my-binder").click({ force: true });
      Fari.get("my-binder.folders.characters").click();
      Fari.get("my-binder.folders.characters.new").click();
      Fari.get("character-dialog.name").clear().type("Luke");
      Fari.get("character-dialog.toggle-advanced").click();
      Fari.get("character-dialog.template-input").click();
      Fari.get("character-dialog.template-input").type("Blank").type("{enter}");
      Fari.get("character-dialog.name").type(" Skywalker");

      // save
      Fari.waitContentEditable();
      Fari.get("character-dialog.save").click();
      cy.contains("Saved");
    });
  });

  describe("Given I want to customize my character sheet", () => {
    it("should let me do it using the advanced mode", () => {
      Fari.start();
      cy.visit("/");

      // new character
      Fari.get("page.menu.my-binder").click({ force: true });
      Fari.get("my-binder.folders.characters").click();
      Fari.get("my-binder.folders.characters.new").click();
      Fari.get("character-dialog.name").type("Luke Skywalker");

      // load fate template
      Fari.get("character-dialog.template-input").click();
      Fari.get("character-dialog.template-input")
        .type("Fate Condensed")
        .type("{enter}");

      Fari.get("character-dialog.toggle-advanced").click();

      // aspects
      Fari.get("character-dialog.ASPECTS.HIGH CONCEPT.label")
        .clear()
        .type("#High Concept");

      // vitals box
      Fari.get("character-dialog.STRESS.PHYSICAL.box.0.label")
        .clear()
        .type("#2");
      Fari.get("character-dialog.STRESS.PHYSICAL.box.1.label")
        .clear()
        .type("#4");
      Fari.get("character-dialog.STRESS.PHYSICAL.box.2.label")
        .clear()
        .type("#6");

      // vitals
      Fari.get("character-dialog.STRESS.PHYSICAL.label")
        .clear()
        .type("#Physical");
      // Fari.get("character-dialog.Stress.Mental.label").clear().type("#Mental");

      // consequences
      Fari.get("character-dialog.CONSEQUENCES.MILD.label")
        .clear()
        .type("#Mild");

      // skills
      Fari.get("character-dialog.SKILLS.ACADEMICS.label")
        .clear()
        .type("#Academics");

      // stunts
      Fari.get("character-dialog.STUNTS & EXTRAS.STUNT #1.label")
        .clear()
        .type("#Stunt #1");

      // Fate Points

      Fari.get("character-dialog.FATE POINTS.FATE POINTS.value")
        .clear()
        .type("1");
      Fari.get("character-dialog.FATE POINTS.FATE POINTS.max")
        .clear()
        .type("5");
      Fari.get("character-dialog.FATE POINTS.FATE POINTS.label")
        .clear()
        .type("#Fate Points");
      Fari.get("character-dialog.FATE POINTS.label")
        .clear()
        .type("#Fate Points");

      // remove
      Fari.get("character-dialog.ASPECTS.#High Concept.delete").click();
      Fari.get("character-dialog.STUNTS & EXTRAS.#Stunt #1.delete").click();
      Fari.get("character-dialog.CONSEQUENCES.#Mild.delete").click();
      Fari.get("character-dialog.SKILLS.#Academics.delete").click();
      Fari.get("character-dialog.STRESS.#Physical.delete").click();

      // slot tracker
      Fari.get("character-dialog.STRESS.MENTAL.add-box").click({ force: true });
      Fari.get("character-dialog.STRESS.MENTAL.remove-box").click({
        force: true,
      });
      Fari.get("character-dialog.STRESS.MENTAL.remove-box").click({
        force: true,
      });
      Fari.get("character-dialog.STRESS.MENTAL.remove-box").click({
        force: true,
      });
      Fari.get("character-dialog.STRESS.MENTAL.remove-box").click({
        force: true,
      });
      Fari.get("character-dialog.STRESS.MENTAL.add-box").click({ force: true });

      // section labels
      Fari.get("character-dialog.ASPECTS.label").clear().type("#Aspects");
      Fari.get("character-dialog.STUNTS & EXTRAS.label")
        .clear()
        .type("#Stunts");
      Fari.get("character-dialog.OTHER.label").clear().type("#Other");
      Fari.get("character-dialog.STRESS.label").clear().type("#Stress");
      Fari.get("character-dialog.CONSEQUENCES.label")
        .clear()
        .type("#Consequences");
      Fari.get("character-dialog.SKILLS.label").clear().type("#Skills");

      // move and remove new sections
      Fari.get("character-dialog.#Aspects.move-section-up").click({
        force: true,
      });
      Fari.get("character-dialog.#Aspects.move-section-down").click({
        force: true,
      });

      Fari.get("character-dialog.#Aspects.delete").click({ force: true });
      Fari.get("character-dialog.#Stunts.move-section-up").click({
        force: true,
      });
      Fari.get("character-dialog.#Stunts.move-section-down").click({
        force: true,
      });

      Fari.get("character-dialog.#Stunts.delete").click({ force: true });
      Fari.get("character-dialog.#Other.move-section-up").click({
        force: true,
      });
      Fari.get("character-dialog.#Other.move-section-down").click({
        force: true,
      });

      Fari.get("character-dialog.#Other.delete").click({ force: true });
      Fari.get("character-dialog.#Stress.move-section-up").click({
        force: true,
      });
      Fari.get("character-dialog.#Stress.move-section-down").click({
        force: true,
      });

      Fari.get("character-dialog.#Stress.delete").click({ force: true });
      Fari.get("character-dialog.#Consequences.move-section-up").click({
        force: true,
      });
      Fari.get("character-dialog.#Consequences.move-section-down").click({
        force: true,
      });

      Fari.get("character-dialog.#Consequences.delete").click({ force: true });
      Fari.get("character-dialog.#Skills.move-section-up").click({
        force: true,
      });
      Fari.get("character-dialog.#Skills.move-section-down").click({
        force: true,
      });
      Fari.get("character-dialog.#Skills.delete").click({ force: true });
      Fari.get("character-dialog.#Fate Points.move-section-up").click({
        force: true,
      });
      Fari.get("character-dialog.#Fate Points.move-section-down").click({
        force: true,
      });

      Fari.get("character-dialog.#Fate Points.delete").click({ force: true });

      // save
      Fari.waitContentEditable();
      Fari.get("character-dialog.save").click();
      cy.contains("Saved");

      // navigate away
      Fari.get("page.menu.home").click({ force: true });

      // re-open sheet
      Fari.get("page.menu.my-binder").click({ force: true });
      Fari.get("my-binder.folders.characters").click();
      cy.contains("Luke Skywalker").click();
    });
  });
});
