import { Fari } from "lib/util/Fari";

describe("Characters", () => {
  it("should support add characters", () => {
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

    Fari.get("character-dialog.stressTrack.Physical.box.0.value").click();
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
