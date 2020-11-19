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
      Fari.get("character-dialog.aspect.High Concept.value").type(
        "The Last Jedi"
      );
      Fari.get("character-dialog.aspect.Trouble.value").type(
        "Everything for my friends"
      );
      Fari.get("character-dialog.aspect.Relationship.value").type(
        "Leia is my sister"
      );
      Fari.get("character-dialog.aspect.Other Aspect.value")
        .eq(0)
        .type("The Dark side calls to me");
      Fari.get("character-dialog.aspect.Other Aspect.value")
        .eq(1)
        .type("Ben Kenobi thought me everything");

      Fari.get("character-dialog.skill.Academics.value").type("4");
      Fari.get("character-dialog.skill.Athletics.value").type("3");
      Fari.get("character-dialog.skill.Burglary.value").type("3");
      Fari.get("character-dialog.skill.Contacts.value").type("2");
      Fari.get("character-dialog.skill.Crafts.value").type("2");
      Fari.get("character-dialog.skill.Deceive.value").type("2");
      Fari.get("character-dialog.skill.Drive.value").type("1");
      Fari.get("character-dialog.skill.Empathy.value").type("1");
      Fari.get("character-dialog.skill.Fight.value").type("1");
      Fari.get("character-dialog.skill.Investigate.value").type("1");

      Fari.get("character-dialog.stressTrack.Physical.label").click();
      Fari.get("character-dialog.stressTrack.Physical.box.1.value").click();
      Fari.get("character-dialog.stressTrack.Mental.box.2.value").click();

      Fari.get("character-dialog.consequence.Mild.value").type("I");
      Fari.get("character-dialog.consequence.Moderate.value").type("Lost");
      Fari.get("character-dialog.consequence.Severe.value").type("An Arm");

      Fari.get("character-dialog.notes").type(
        "A long time ago in a galaxy far, far away...."
      );
      Fari.get("character-dialog.group").find("input").type("Star Wars");

      // save
      Fari.waitContentEditable();
      Fari.get("character-dialog.save").click();
      cy.contains("Saved");

      // navigate away
      Fari.get("page.menu.play").click();

      // re-open sheet
      Fari.get("page.menu.characters").click();
      cy.contains("Star Wars");
      cy.contains("Luke Skywalker").click();

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
    });
  });

  describe("Given I want a to use a template", () => {
    it("should let me do it", () => {
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
    it("should support adding, filling up and removing a character", () => {
      Fari.start();
      cy.visit("/");

      // new character
      Fari.get("page.menu.characters").click();
      Fari.get("manager.new").click();
      Fari.get("character-dialog.name").type("Luke Skywalker");

      Fari.get("character-dialog.toggle-advanced").click();

      // aspects
      Fari.get("character-dialog.aspect.High Concept.label")
        .clear()
        .type("#High Concept");
      Fari.get("character-dialog.aspect.Trouble.label")
        .clear()
        .type("#Trouble");
      Fari.get("character-dialog.aspect.Relationship.label")
        .clear()
        .type("#Relationship");
      Fari.get("character-dialog.aspect.Other Aspect.label")
        .eq(0)
        .clear()
        .type("#Other Aspect");
      Fari.get("character-dialog.aspect.Other Aspect.label")
        .eq(1)
        .clear()
        .type("#Other Aspect");

      // vitals box
      Fari.get("character-dialog.stressTrack.Physical.box.0.label")
        .clear()
        .type("#2");
      Fari.get("character-dialog.stressTrack.Physical.box.1.label")
        .clear()
        .type("#4");
      Fari.get("character-dialog.stressTrack.Physical.box.2.label")
        .clear()
        .type("#6");
      Fari.get("character-dialog.stressTrack.Mental.box.0.label")
        .clear()
        .type("#2");
      Fari.get("character-dialog.stressTrack.Mental.box.1.label")
        .clear()
        .type("#4");
      Fari.get("character-dialog.stressTrack.Mental.box.2.label")
        .clear()
        .type("#6");

      // vitals
      Fari.get("character-dialog.stressTrack.Physical.label")
        .clear()
        .type("#Physical");
      Fari.get("character-dialog.stressTrack.Mental.label")
        .clear()
        .type("#Mental");

      // consequences
      Fari.get("character-dialog.consequence.Mild.label").clear().type("#Mild");
      Fari.get("character-dialog.consequence.Moderate.label")
        .clear()
        .type("#Moderate");
      Fari.get("character-dialog.consequence.Severe.label")
        .clear()
        .type("#Severe");

      // skills
      Fari.get("character-dialog.skill.Academics.label")
        .clear()
        .type("#Academics");
      Fari.get("character-dialog.skill.Athletics.label")
        .clear()
        .type("#Athletics");
      Fari.get("character-dialog.skill.Burglary.label")
        .clear()
        .type("#Burglary");
      Fari.get("character-dialog.skill.Contacts.label")
        .clear()
        .type("#Contacts");
      Fari.get("character-dialog.skill.Crafts.label").clear().type("#Crafts");
      Fari.get("character-dialog.skill.Deceive.label").clear().type("#Deceive");
      Fari.get("character-dialog.skill.Drive.label").clear().type("#Drive");
      Fari.get("character-dialog.skill.Empathy.label").clear().type("#Empathy");
      Fari.get("character-dialog.skill.Fight.label").clear().type("#Fight");
      Fari.get("character-dialog.skill.Investigate.label")
        .clear()
        .type("#Investigate");
      Fari.get("character-dialog.skill.Lore.label").clear().type("#Lore");
      Fari.get("character-dialog.skill.Notice.label").clear().type("#Notice");
      Fari.get("character-dialog.skill.Physique.label")
        .clear()
        .type("#Physique");
      Fari.get("character-dialog.skill.Provoke.label").clear().type("#Provoke");
      Fari.get("character-dialog.skill.Rapport.label").clear().type("#Rapport");
      Fari.get("character-dialog.skill.Resources.label")
        .clear()
        .type("#Resources");
      Fari.get("character-dialog.skill.Shoot.label").clear().type("#Shoot");
      Fari.get("character-dialog.skill.Stealth.label").clear().type("#Stealth");
      Fari.get("character-dialog.skill.Will.label").clear().type("#Will");

      // stunts
      Fari.get("character-dialog.stunt.Stunt #1.label")
        .clear()
        .type("#Stunt #1");
      Fari.get("character-dialog.stunt.Stunt #2.label")
        .clear()
        .type("#Stunt #2");
      Fari.get("character-dialog.stunt.Stunt #3.label")
        .clear()
        .type("#Stunt #3");
      Fari.get("character-dialog.refresh").clear().type("4");

      // move up, move down, remove
      Fari.get("character-dialog.aspect.#High Concept.move-up").click();
      Fari.get("character-dialog.aspect.#High Concept.move-down").click();
      Fari.get("character-dialog.aspect.#High Concept.remove").click();

      Fari.get("character-dialog.stunt.#Stunt #1.move-up").click();
      Fari.get("character-dialog.stunt.#Stunt #1.move-down").click();
      Fari.get("character-dialog.stunt.#Stunt #1.remove").click();

      Fari.get("character-dialog.consequence.#Mild.move-up").click();
      Fari.get("character-dialog.consequence.#Moderate.move-down").click();
      Fari.get("character-dialog.consequence.#Severe.remove").click();

      Fari.get("character-dialog.skill.#Academics.move-up").click();
      Fari.get("character-dialog.skill.#Academics.move-down").click();
      Fari.get("character-dialog.skill.#Academics.remove").click();

      Fari.get("character-dialog.stressTrack.#Physical.move-up").click();
      Fari.get("character-dialog.stressTrack.#Physical.move-down").click();
      Fari.get("character-dialog.stressTrack.#Physical.remove").click();

      Fari.get("character-dialog.stressTrack.#Mental.add-box").click();
      Fari.get("character-dialog.stressTrack.#Mental.remove-box").click();
      Fari.get("character-dialog.stressTrack.#Mental.remove-box").click();
      Fari.get("character-dialog.stressTrack.#Mental.remove-box").click();
      Fari.get("character-dialog.stressTrack.#Mental.remove-box").click();

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
