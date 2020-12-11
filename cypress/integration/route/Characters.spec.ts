import { Fari } from "lib/util/Fari";

describe("/characters", () => {
  describe("Given I want to create a simple character sheet", () => {
    it("should support adding, filling up and removing a character", () => {
      Fari.start();
      cy.visit("/");

      // new character
      Fari.get("page.menu.characters").click();
      Fari.get("manager.new").click();
      Fari.get("character-dialog.name").type("Luke Skywalker");

      // fill up fields
      Fari.get("character-dialog.Aspects.High Concept.value").type(
        "The Last Jedi"
      );
      Fari.get("character-dialog.Aspects.Trouble.value").type(
        "Everything for my friends"
      );
      Fari.get("character-dialog.Aspects.Relationship.value").type(
        "Leia is my sister"
      );
      Fari.get("character-dialog.Aspects.Other Aspect.value")
        .eq(0)
        .type("The Dark side calls to me");
      Fari.get("character-dialog.Aspects.Other Aspect.value")
        .eq(1)
        .type("Ben Kenobi thought me everything");

      Fari.get("character-dialog.Skills.Academics.value").type("4");
      Fari.get("character-dialog.Skills.Athletics.value").type("3");
      Fari.get("character-dialog.Skills.Burglary.value").type("3");
      Fari.get("character-dialog.Skills.Contacts.value").type("2");
      Fari.get("character-dialog.Skills.Crafts.value").type("2");
      Fari.get("character-dialog.Skills.Deceive.value").type("2");
      Fari.get("character-dialog.Skills.Drive.value").type("1");
      Fari.get("character-dialog.Skills.Empathy.value").type("1");
      Fari.get("character-dialog.Skills.Fight.value").type("1");
      Fari.get("character-dialog.Skills.Investigate.value").type("1");

      Fari.get("character-dialog.Stress.Physical.label").click();
      Fari.get("character-dialog.Stress.Physical.box.1.value").click();
      Fari.get("character-dialog.Stress.Mental.box.2.value").click();

      Fari.get("character-dialog.Consequences.Mild.value").type("I");
      Fari.get("character-dialog.Consequences.Moderate.value").type("Lost");
      Fari.get("character-dialog.Consequences.Severe.value").type("An Arm");

      Fari.get("character-dialog.Other.Notes.value").type(
        "A long time ago in a galaxy far, far away...."
      );
      Fari.get("character-dialog.group").find("input").type("Star Wars");

      // save
      cy.title().should("eq", "Manage your Characters | Fari");
      Fari.waitContentEditable();
      Fari.get("character-dialog.save").click();
      cy.title().should("eq", "Luke Skywalker | Fari");
      cy.contains("Saved");

      // navigate away
      Fari.get("page.menu.play").click();

      // re-open sheet
      Fari.get("page.menu.characters").click();
      cy.contains("Star Wars");
      cy.contains("Luke Skywalker").click();
      cy.title().should("eq", "Luke Skywalker | Fari");

      // roll dice in sheet
      Fari.get("dice").click();
      Fari.get("dice").invoke("attr", "data-cy-rolling").should("eq", "false");
      Fari.get("dice")
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

      // delete
      Fari.get("page.menu.characters").click();
      Fari.get("manager.delete").click();
      cy.contains("Star Wars").should("not.exist");
      cy.contains("Luke Skywalker").should("not.exist");

      // should be back to home page
      cy.url().should("eq", "http://localhost:1234/");

      // undo
      cy.contains("Undo").click();
      cy.contains("Star Wars");
      cy.contains("Luke Skywalker").click();

      // character card
      Fari.get("page.menu.home").click();
      Fari.get("home.play-offline").click();

      Fari.get("scene.add-offline-character").click();
      Fari.get("scene.offline-character-dialog.pick-existing").click();

      cy.contains("Luke Skywalker").click();

      Fari.get("character-card").contains("Luke Skywalker");
      Fari.get("character-card.open-character-sheet").click();
      Fari.get("character-dialog.close").click();

      // character card roll skill
      Fari.get("character-card.Skills.label.Athletics").click();
      Fari.get("scene.player-row.1")
        .find('[data-cy="dice"]')
        .invoke("attr", "data-cy-value")
        .should("be.oneOf", [
          "-1",
          "0",
          "+1",
          "+2",
          "+3",
          "+4",
          "+5",
          "+6",
          "+7",
        ]);
    });
  });

  describe("Given I want a to use a template", () => {
    it("should let load a template", () => {
      Fari.start();
      cy.visit("/");

      // new character
      Fari.get("page.menu.characters").click();
      Fari.get("manager.new").click();
      Fari.get("character-dialog.name").type("Luke");
      Fari.get("character-dialog.toggle-advanced").click();
      Fari.get("character-dialog.template").click();
      Fari.get("character-dialog.template.Custom").click();
      Fari.get("character-dialog.load-template").click();
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
      Fari.get("page.menu.characters").click();
      Fari.get("manager.new").click();
      Fari.get("character-dialog.name").type("Luke Skywalker");

      Fari.get("character-dialog.toggle-advanced").click();

      // aspects
      Fari.get("character-dialog.Aspects.High Concept.label")
        .clear()
        .type("#High Concept");
      Fari.get("character-dialog.Aspects.Trouble.label")
        .clear()
        .type("#Trouble");
      Fari.get("character-dialog.Aspects.Relationship.label")
        .clear()
        .type("#Relationship");
      Fari.get("character-dialog.Aspects.Other Aspect.label")
        .eq(0)
        .clear()
        .type("#Other Aspect");
      Fari.get("character-dialog.Aspects.Other Aspect.label")
        .eq(1)
        .clear()
        .type("#Other Aspect");

      // vitals box
      Fari.get("character-dialog.Stress.Physical.box.0.label")
        .clear()
        .type("#2");
      Fari.get("character-dialog.Stress.Physical.box.1.label")
        .clear()
        .type("#4");
      Fari.get("character-dialog.Stress.Physical.box.2.label")
        .clear()
        .type("#6");
      Fari.get("character-dialog.Stress.Mental.box.0.label").clear().type("#2");
      Fari.get("character-dialog.Stress.Mental.box.1.label").clear().type("#4");
      Fari.get("character-dialog.Stress.Mental.box.2.label").clear().type("#6");

      // vitals
      Fari.get("character-dialog.Stress.Physical.label")
        .clear()
        .type("#Physical");
      Fari.get("character-dialog.Stress.Mental.label").clear().type("#Mental");

      // consequences
      Fari.get("character-dialog.Consequences.Mild.label")
        .clear()
        .type("#Mild");
      Fari.get("character-dialog.Consequences.Moderate.label")
        .clear()
        .type("#Moderate");
      Fari.get("character-dialog.Consequences.Severe.label")
        .clear()
        .type("#Severe");

      // skills
      Fari.get("character-dialog.Skills.Academics.label")
        .clear()
        .type("#Academics");
      Fari.get("character-dialog.Skills.Athletics.label")
        .clear()
        .type("#Athletics");
      Fari.get("character-dialog.Skills.Burglary.label")
        .clear()
        .type("#Burglary");
      Fari.get("character-dialog.Skills.Contacts.label")
        .clear()
        .type("#Contacts");
      Fari.get("character-dialog.Skills.Crafts.label").clear().type("#Crafts");
      Fari.get("character-dialog.Skills.Deceive.label")
        .clear()
        .type("#Deceive");
      Fari.get("character-dialog.Skills.Drive.label").clear().type("#Drive");
      Fari.get("character-dialog.Skills.Empathy.label")
        .clear()
        .type("#Empathy");
      Fari.get("character-dialog.Skills.Fight.label").clear().type("#Fight");
      Fari.get("character-dialog.Skills.Investigate.label")
        .clear()
        .type("#Investigate");
      Fari.get("character-dialog.Skills.Lore.label").clear().type("#Lore");
      Fari.get("character-dialog.Skills.Notice.label").clear().type("#Notice");
      Fari.get("character-dialog.Skills.Physique.label")
        .clear()
        .type("#Physique");
      Fari.get("character-dialog.Skills.Provoke.label")
        .clear()
        .type("#Provoke");
      Fari.get("character-dialog.Skills.Rapport.label")
        .clear()
        .type("#Rapport");
      Fari.get("character-dialog.Skills.Resources.label")
        .clear()
        .type("#Resources");
      Fari.get("character-dialog.Skills.Shoot.label").clear().type("#Shoot");
      Fari.get("character-dialog.Skills.Stealth.label")
        .clear()
        .type("#Stealth");
      Fari.get("character-dialog.Skills.Will.label").clear().type("#Will");

      // stunts
      Fari.get("character-dialog.Stunts & Extras.Stunt #1.label")
        .clear()
        .type("#Stunt #1");
      Fari.get("character-dialog.Stunts & Extras.Stunt #2.label")
        .clear()
        .type("#Stunt #2");
      Fari.get("character-dialog.Stunts & Extras.Stunt #3.label")
        .clear()
        .type("#Stunt #3");
      Fari.get("character-dialog.refresh").clear().type("4");

      // remove
      Fari.get("character-dialog.Aspects.#High Concept.remove").click();
      Fari.get("character-dialog.Stunts & Extras.#Stunt #1.remove").click();
      Fari.get("character-dialog.Consequences.#Severe.remove").click();
      Fari.get("character-dialog.Skills.#Academics.remove").click();
      Fari.get("character-dialog.Stress.#Physical.remove").click();

      Fari.get("character-dialog.Stress.#Mental.add-box").click();
      Fari.get("character-dialog.Stress.#Mental.remove-box").click();
      Fari.get("character-dialog.Stress.#Mental.remove-box").click();
      Fari.get("character-dialog.Stress.#Mental.remove-box").click();
      Fari.get("character-dialog.Stress.#Mental.remove-box").click();
      Fari.get("character-dialog.Stress.#Mental.add-box").click();

      // section labels
      Fari.get("character-dialog.Aspects.label").clear().type("#Aspects");
      Fari.get("character-dialog.Stunts & Extras.label")
        .clear()
        .type("#Stunts");
      Fari.get("character-dialog.Other.label").clear().type("#Other");
      Fari.get("character-dialog.Stress.label").clear().type("#Stress");
      Fari.get("character-dialog.Consequences.label")
        .clear()
        .type("#Consequences");
      Fari.get("character-dialog.Skills.label").clear().type("#Skills");

      // section field
      Fari.get("character-dialog.#Aspects.add-section-field").click();
      Fari.get("character-dialog.#Stunts.add-section-field").click();
      Fari.get("character-dialog.#Other.add-section-field").click();
      Fari.get("character-dialog.#Stress.add-section-field").click();
      Fari.get("character-dialog.#Consequences.add-section-field").click();
      Fari.get("character-dialog.#Skills.add-section-field").click();

      // move and remove new sections
      Fari.get("character-dialog.#Aspects.move-up").click();
      Fari.get("character-dialog.#Aspects.move-down").click();
      Fari.get("character-dialog.#Aspects.remove").click();
      Fari.get("character-dialog.#Stunts.move-up").click();
      Fari.get("character-dialog.#Stunts.move-down").click();
      Fari.get("character-dialog.#Stunts.remove").click();
      Fari.get("character-dialog.#Other.move-up").click();
      Fari.get("character-dialog.#Other.move-down").click();
      Fari.get("character-dialog.#Other.remove").click();
      Fari.get("character-dialog.#Stress.move-up").click();
      Fari.get("character-dialog.#Stress.move-down").click();
      Fari.get("character-dialog.#Stress.remove").click();
      Fari.get("character-dialog.#Consequences.move-up").click();
      Fari.get("character-dialog.#Consequences.move-down").click();
      Fari.get("character-dialog.#Consequences.remove").click();
      Fari.get("character-dialog.#Skills.move-up").click();
      Fari.get("character-dialog.#Skills.move-down").click();
      Fari.get("character-dialog.#Skills.remove").click();

      // save
      Fari.waitContentEditable();
      Fari.get("character-dialog.save").click();
      cy.contains("Saved");

      // navigate away
      Fari.get("page.menu.play").click();

      // re-open sheet
      Fari.get("page.menu.characters").click();
      cy.contains("Luke Skywalker").click();
    });
  });
});
