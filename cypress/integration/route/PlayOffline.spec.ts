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
    Fari.get(
      "scene.player-row.gm-npc-0.character-sheet-dialog.assign-original"
    ).click();
    Fari.get("my-binder.folders.characters.new").click();
    Fari.get(
      "scene.player-row.gm-npc-0.assign-or-open-character-sheet"
    ).click();
    Fari.get("character-dialog.name").clear().type("Luke Skywalker");
    Fari.waitContentEditable();
    Fari.get("character-dialog.save").click();
    Fari.get("character-dialog.close").click();

    // add leia
    Fari.get("scene.add-player").click();
    Fari.get(
      "scene.player-row.gm-npc-1.assign-or-open-character-sheet"
    ).click();
    Fari.get(
      "scene.player-row.gm-npc-1.character-sheet-dialog.assign-original"
    ).click();
    Fari.get("my-binder.folders.characters.new").click();
    Fari.get(
      "scene.player-row.gm-npc-1.assign-or-open-character-sheet"
    ).click();
    Fari.get("character-dialog.name").clear().type("Leia Organa");
    Fari.waitContentEditable();
    Fari.get("character-dialog.save").click();
    Fari.get("character-dialog.close").click();

    // play
    Fari.get("scene.player-row.gm-npc-0.toggle-initiative").click();
    Fari.get("scene.player-row.gm-npc-1.toggle-initiative").click();

    Fari.get("scene.player-row.gm-npc-0.counter.decrement").click({
      force: true,
    });
    Fari.get("scene.player-row.gm-npc-0.counter.decrement").click({
      force: true,
    });
    Fari.get("scene.player-row.gm-npc-0.counter.decrement").click({
      force: true,
    });

    Fari.get("scene.player-row.gm-npc-1.counter.decrement").click({
      force: true,
    });
    Fari.get("scene.player-row.gm-npc-1.counter.decrement").click({
      force: true,
    });
    Fari.get("scene.player-row.gm-npc-1.counter.decrement").click({
      force: true,
    });

    Fari.get("scene.player-row.gm-npc-0").find("[data-cy='dice']").click();
    Fari.get("scene.player-row.gm-npc-1").find("[data-cy='dice']").click();

    Fari.get("scene.player-row.gm-npc-0.counter.increment").click({
      force: true,
    });
    Fari.get("scene.player-row.gm-npc-0.counter.increment").click({
      force: true,
    });
    Fari.get("scene.player-row.gm-npc-0.counter.increment").click({
      force: true,
    });
    Fari.get("scene.player-row.gm-npc-0.counter.increment").click({
      force: true,
    });

    Fari.get("scene.player-row.gm-npc-0.counter.decrement").click({
      force: true,
    });

    Fari.get("scene.reset-initiative").click();

    Fari.get("scene.player-row.gm-npc-1.remove").click({ force: true });
  });
});
