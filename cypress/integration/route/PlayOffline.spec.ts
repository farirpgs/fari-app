import { Fari } from "lib/util/Fari";

describe("/play-offline", () => {
  it("Should roll dice", () => {
    Fari.start();
    Fari.get("home.play-offline").click();

    // add luke
    Fari.get("scene.add-player").click();
    Fari.get("scene.player-row.1.assign-or-open-character-sheet").click();
    Fari.get(
      "scene.player-row.1.character-sheet-dialog.assign-original"
    ).click();
    Fari.get("manager.new").click();
    Fari.get("scene.player-row.1.assign-or-open-character-sheet").click();
    Fari.get("character-dialog.name").type("Luke Skywalker");
    Fari.waitContentEditable();
    Fari.get("character-dialog.save").click();

    // add leia
    Fari.get("scene.add-player").click();
    Fari.get("scene.player-row.2.assign-or-open-character-sheet").click();
    Fari.get(
      "scene.player-row.2.character-sheet-dialog.assign-original"
    ).click();
    Fari.get("manager.new").click();
    Fari.get("scene.player-row.2.assign-or-open-character-sheet").click();
    Fari.get("character-dialog.name").type("Leia Organa");
    Fari.waitContentEditable();
    Fari.get("character-dialog.save").click();

    // play
    Fari.get("scene.player-row.1.toggle-initiative").click();
    Fari.get("scene.player-row.2.toggle-initiative").click();

    Fari.get("scene.player-row.1.counter.decrement").click({ force: true });
    Fari.get("scene.player-row.1.counter.decrement").click({ force: true });
    Fari.get("scene.player-row.1.counter.decrement").click({ force: true });

    Fari.get("scene.player-row.2.counter.decrement").click({ force: true });
    Fari.get("scene.player-row.2.counter.decrement").click({ force: true });
    Fari.get("scene.player-row.2.counter.decrement").click({ force: true });

    Fari.get("scene.player-row.1").find("[data-cy='dice']").click();
    Fari.get("scene.player-row.2").find("[data-cy='dice']").click();

    Fari.get("scene.player-row.1.counter.increment").click({ force: true });
    Fari.get("scene.player-row.1.counter.increment").click({ force: true });
    Fari.get("scene.player-row.1.counter.increment").click({ force: true });
    Fari.get("scene.player-row.1.counter.increment").click({ force: true });

    Fari.get("scene.player-row.0.counter.decrement").click({ force: true });

    Fari.get("scene.reset-initiative").click();

    Fari.get("scene.player-row.2.remove").click({ force: true });
  });
});
