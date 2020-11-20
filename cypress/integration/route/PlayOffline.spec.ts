import { Fari } from "lib/util/Fari";

afterEach(() => {
  cy.screenshot();
});

describe("/dice", () => {
  it("Should roll dice", () => {
    Fari.start();
    Fari.get("home.play-offline").click();

    // open then close offline character
    Fari.get("scene.add-offline-character").click();
    Fari.get("scene.offline-character-dialog.cancel").click();

    // add offline character
    Fari.get("scene.add-offline-character").click();
    Fari.get("scene.offline-character-dialog.name").type("Luke Skywalker");
    Fari.get("scene.offline-character-dialog.add").click();

    Fari.get("scene.add-offline-character").click();
    Fari.get("scene.offline-character-dialog.name").type("Leia Organa");
    Fari.get("scene.offline-character-dialog.add").click();

    // play
    Fari.get("scene.player-row.0.toggle-initiative").click();
    Fari.get("scene.player-row.1.toggle-initiative").click();

    Fari.get("scene.player-row.0.consume-fate-point").click();
    Fari.get("scene.player-row.0.consume-fate-point").click();
    Fari.get("scene.player-row.0.consume-fate-point").click();

    Fari.get("scene.player-row.1.consume-fate-point").click();
    Fari.get("scene.player-row.1.consume-fate-point").click();
    Fari.get("scene.player-row.1.consume-fate-point").click();

    Fari.get("scene.player-row.0").find("[data-cy='dice']").click();
    Fari.get("scene.player-row.1").find("[data-cy='dice']").click();

    Fari.get("scene.player-row.0.refresh-fate-point-gm").click();
    Fari.get("scene.player-row.0.refresh-fate-point-gm").click();
    Fari.get("scene.player-row.0.refresh-fate-point-gm").click();
    Fari.get("scene.player-row.0.refresh-fate-point-gm").click();

    Fari.get("scene.player-row.0.consume-fate-point-gm").click();

    Fari.get("scene.reset-initiative").click();

    Fari.get("scene.player-row.2.remove").click();
  });
});
