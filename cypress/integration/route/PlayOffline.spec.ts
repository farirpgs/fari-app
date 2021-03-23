import { Fari } from "lib/util/Fari";

describe("/play-offline", () => {
  it("Should roll dice", () => {
    Fari.start();
    Fari.get("home.play-offline").click();

    // add luke
    Fari.get("scene.add-player").click();
    Fari.get("manager.new").click();
    Fari.get("scene.player-row.1.open-character-sheet").click();
    Fari.get("character-dialog.name").type("Luke Skywalker");
    Fari.waitContentEditable();
    Fari.get("character-dialog.save").click();

    // add leia
    Fari.get("scene.add-player").click();
    Fari.get("manager.new").click();
    Fari.get("scene.player-row.2.open-character-sheet").click();
    Fari.get("character-dialog.name").type("Leia Organa");
    Fari.waitContentEditable();
    Fari.get("character-dialog.save").click();

    // play
    Fari.get("scene.player-row.1.toggle-initiative").click();
    Fari.get("scene.player-row.2.toggle-initiative").click();

    Fari.get("scene.player-row.1.consume-fate-point").click();
    Fari.get("scene.player-row.1.consume-fate-point").click();
    Fari.get("scene.player-row.1.consume-fate-point").click();

    Fari.get("scene.player-row.2.consume-fate-point").click();
    Fari.get("scene.player-row.2.consume-fate-point").click();
    Fari.get("scene.player-row.2.consume-fate-point").click();

    Fari.get("scene.player-row.1").find("[data-cy='dice']").click();
    Fari.get("scene.player-row.2").find("[data-cy='dice']").click();

    Fari.get("scene.player-row.1.refresh-fate-point-gm").click();
    Fari.get("scene.player-row.1.refresh-fate-point-gm").click();
    Fari.get("scene.player-row.1.refresh-fate-point-gm").click();
    Fari.get("scene.player-row.1.refresh-fate-point-gm").click();

    Fari.get("scene.player-row.1.consume-fate-point-gm").click();

    Fari.get("scene.reset-initiative").click();

    Fari.get("scene.player-row.2.remove").click();
  });
});
