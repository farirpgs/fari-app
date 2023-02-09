import { Fari } from "lib/util/Fari";

describe("/play-offline", () => {
  it("Should roll dice", () => {
    Fari.start();
    Fari.get("home.play-offline").click();

    // add luke
    Fari.get("scene.add-player").click();
    Fari.get(
      "scene.player-row.gm-npc-0.assign-or-open-character-sheet"
    ).click();
    Fari.get("my-binder.folders.characters.new").click();

    Fari.get("character-dialog.name").clear().type("Luke Skywalker");
    Fari.waitContentEditable();

    // add leia
    Fari.get("scene.add-player").click();
    Fari.get(
      "scene.player-row.gm-npc-1.assign-or-open-character-sheet"
    ).click();
    Fari.get("my-binder.folders.characters.new").click();

    Fari.get("character-dialog.name").clear().type("Leia Organa");
    Fari.waitContentEditable();

    Fari.get("scene.player-row.gm-npc-1.remove").click({ force: true });
  });
});
