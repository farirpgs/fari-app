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

      cy.title().should("contain", "Fari App | ");
      Fari.waitContentEditable();
      Fari.get("character-dialog.save").click();
      cy.title().should("eq", "Luke Skywalker | Fari");
      cy.contains("Saved");

      // navigate away
      Fari.get("page.menu.home").click();

      // re-open sheet
      Fari.get("page.menu.my-binder").click();
      Fari.get("my-binder.folders.characters").click();

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
      Fari.get("page.menu.my-binder").click();
      Fari.get("my-binder.folders.characters").click();

      Fari.get("my-binder.element.Luke Skywalker.delete").first().click();
      cy.contains("Star Wars").should("not.exist");
      cy.contains("Luke Skywalker").should("not.exist");

      // should be back to home page
      cy.url().should("eq", "http://localhost:1234/");

      // undo
      cy.contains("Undo").click();
      cy.contains("Luke Skywalker").click();

      // character card
      Fari.get("page.menu.home").click();
      Fari.get("home.play-offline").click();

      // add player
      Fari.get("scene.add-player").click();
      Fari.get(
        "scene.player-row.gm-npc-0.assign-or-open-character-sheet"
      ).click();
      Fari.get(
        "scene.player-row.gm-npc-0.character-sheet-dialog.assign-original"
      ).click();

      cy.contains("Luke Skywalker").click();

      // Fari.get("session.tabs.characters").click();
      // Fari.get("character-card").contains("Luke Skywalker");
      // Fari.get("character-card.open-character-sheet").click();
      // Fari.get("character-dialog.close").click();

      // // character card roll skill
      // Fari.get("character-card.section.Skills.block.Athletics").click();
      Fari.get("scene.player-row.gm-npc-0")
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
      Fari.get("character-dialog.Aspects.High Concept.label")
        .clear()
        .type("#High Concept");

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

      // vitals
      Fari.get("character-dialog.Stress.Physical.label")
        .clear()
        .type("#Physical");
      // Fari.get("character-dialog.Stress.Mental.label").clear().type("#Mental");

      // consequences
      Fari.get("character-dialog.Consequences.Mild.label")
        .clear()
        .type("#Mild");

      // skills
      Fari.get("character-dialog.Skills.Academics.label")
        .clear()
        .type("#Academics");

      // stunts
      Fari.get("character-dialog.Stunts & Extras.Stunt #1.label")
        .clear()
        .type("#Stunt #1");

      // Fate Points

      Fari.get("character-dialog.Fate Points.Fate Points.value")
        .clear()
        .type("1");
      Fari.get("character-dialog.Fate Points.Fate Points.max")
        .clear()
        .type("5");
      Fari.get("character-dialog.Fate Points.Fate Points.label")
        .clear()
        .type("#Fate Points");
      Fari.get("character-dialog.Fate Points.label")
        .clear()
        .type("#Fate Points");

      // remove
      Fari.get("character-dialog.Aspects.#High Concept.remove").click();
      Fari.get("character-dialog.Stunts & Extras.#Stunt #1.remove").click();
      Fari.get("character-dialog.Consequences.#Mild.remove").click();
      Fari.get("character-dialog.Skills.#Academics.remove").click();
      Fari.get("character-dialog.Stress.#Physical.remove").click();

      // slot tracker
      Fari.get("character-dialog.Stress.Mental.add-box").click({ force: true });
      Fari.get("character-dialog.Stress.Mental.remove-box").click({
        force: true,
      });
      Fari.get("character-dialog.Stress.Mental.remove-box").click({
        force: true,
      });
      Fari.get("character-dialog.Stress.Mental.remove-box").click({
        force: true,
      });
      Fari.get("character-dialog.Stress.Mental.remove-box").click({
        force: true,
      });
      Fari.get("character-dialog.Stress.Mental.add-box").click({ force: true });

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

      // move and remove new sections
      Fari.get("character-dialog.#Aspects.move").click({ force: true });
      Fari.get("character-dialog.#Aspects.move-up").click({ force: true });
      Fari.get("character-dialog.#Aspects.move").click({ force: true });
      Fari.get("character-dialog.#Aspects.move-down").click({ force: true });
      Fari.get("character-dialog.#Aspects.move").click({ force: true });
      Fari.get("character-dialog.#Aspects.switch-side").click({ force: true });
      Fari.get("character-dialog.#Aspects.remove").click({ force: true });
      Fari.get("character-dialog.#Stunts.move").click({ force: true });
      Fari.get("character-dialog.#Stunts.move-up").click({ force: true });
      Fari.get("character-dialog.#Stunts.move").click({ force: true });
      Fari.get("character-dialog.#Stunts.move-down").click({ force: true });
      Fari.get("character-dialog.#Stunts.move").click({ force: true });
      Fari.get("character-dialog.#Stunts.switch-side").click({ force: true });
      Fari.get("character-dialog.#Stunts.remove").click({ force: true });
      Fari.get("character-dialog.#Other.move").click({ force: true });
      Fari.get("character-dialog.#Other.move-up").click({ force: true });
      Fari.get("character-dialog.#Other.move").click({ force: true });
      Fari.get("character-dialog.#Other.move-down").click({ force: true });
      Fari.get("character-dialog.#Other.move").click({ force: true });
      Fari.get("character-dialog.#Other.switch-side").click({ force: true });
      Fari.get("character-dialog.#Other.remove").click({ force: true });
      Fari.get("character-dialog.#Stress.move").click({ force: true });
      Fari.get("character-dialog.#Stress.move-up").click({ force: true });
      Fari.get("character-dialog.#Stress.move").click({ force: true });
      Fari.get("character-dialog.#Stress.move-down").click({ force: true });
      Fari.get("character-dialog.#Stress.move").click({ force: true });
      Fari.get("character-dialog.#Stress.switch-side").click({ force: true });
      Fari.get("character-dialog.#Stress.remove").click({ force: true });
      Fari.get("character-dialog.#Consequences.move").click({ force: true });
      Fari.get("character-dialog.#Consequences.move-up").click({ force: true });
      Fari.get("character-dialog.#Consequences.move").click({ force: true });
      Fari.get("character-dialog.#Consequences.move-down").click({
        force: true,
      });
      Fari.get("character-dialog.#Consequences.move").click({ force: true });
      Fari.get("character-dialog.#Consequences.switch-side").click({
        force: true,
      });
      Fari.get("character-dialog.#Consequences.remove").click({ force: true });
      Fari.get("character-dialog.#Skills.move").click({ force: true });
      Fari.get("character-dialog.#Skills.move-up").click({ force: true });
      Fari.get("character-dialog.#Skills.move").click({ force: true });
      Fari.get("character-dialog.#Skills.move-down").click({ force: true });
      Fari.get("character-dialog.#Skills.move").click({ force: true });
      Fari.get("character-dialog.#Skills.switch-side").click({ force: true });
      Fari.get("character-dialog.#Skills.remove").click({ force: true });
      Fari.get("character-dialog.#Fate Points.move").click({ force: true });
      Fari.get("character-dialog.#Fate Points.move-up").click({ force: true });
      Fari.get("character-dialog.#Fate Points.move").click({ force: true });
      Fari.get("character-dialog.#Fate Points.move-down").click({
        force: true,
      });
      Fari.get("character-dialog.#Fate Points.move").click({ force: true });
      Fari.get("character-dialog.#Fate Points.switch-side").click({
        force: true,
      });
      Fari.get("character-dialog.#Fate Points.remove").click({ force: true });

      // save
      Fari.waitContentEditable();
      Fari.get("character-dialog.save").click();
      cy.contains("Saved");

      // navigate away
      Fari.get("page.menu.home").click();

      // re-open sheet
      Fari.get("page.menu.my-binder").click();
      Fari.get("my-binder.folders.characters").click();
      cy.contains("Luke Skywalker").click();
    });
  });
});
