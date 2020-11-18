import { Fari } from "lib/util/Fari";

describe("/scenes", () => {
  describe("Given I want to create a scene", () => {
    it("should support adding, filling up and removing a scene", () => {
      Fari.start();
      cy.visit("/");

      // new scene
      Fari.get("page.menu.scenes").click();
      Fari.get("manager.new").click();

      // set fields
      Fari.get("scene.name").type("Ba Sing Se");
      Fari.get("scene.group").type("Avatar");

      Fari.get("scene.add-aspect").click();
      Fari.get("scene.add-boost").click();
      Fari.get("scene.add-npc").click();
      Fari.get("scene.add-bad-guy").click();
      Fari.get("scene.add-index-card").click();

      // aspect
      Fari.get("scene.aspect.0.title").type("Something weird is going on");
      Fari.get("scene.aspect.0.content").type("There is no war in Ba Sing Se");

      // menu
      Fari.get("scene.aspect.0.menu").click();
      Fari.get("scene.aspect.0.menu.free-invokes").click();
      Fari.get("scene.aspect.0.menu.physical-stress").click();
      Fari.get("scene.aspect.0.menu.mental-stress").click();
      Fari.get("scene.aspect.0.menu.consequence").click();
      Fari.get("scene.aspect.0.menu.consequence").click();
      Fari.get("scene.aspect.0.menu.track").click();

      Fari.get("scene.aspect.0.menu.color.blue").click();
      Fari.get("scene.aspect.0.menu.color.green").click();
      Fari.get("scene.aspect.0.menu.color.red").click();
      Fari.get("scene.aspect.0.menu.color.white").click();
      Fari.get("scene.aspect.0.menu.color.yellow").click();

      // close backdrop
      Fari.closeBackdrop();

      // aspect tracks
      Fari.get("scene.aspect.0.stressTrack.Free Invokes.add-box").click();
      Fari.get("scene.aspect.0.stressTrack.Free Invokes.add-box").click();
      Fari.get("scene.aspect.0.stressTrack.Free Invokes.add-box").click();
      Fari.get("scene.aspect.0.stressTrack.Free Invokes.remove-box").click();

      Fari.get("scene.aspect.0.stressTrack.Free Invokes.name")
        .clear()
        .type("#Free Invokes");
      Fari.get("scene.aspect.0.stressTrack.Physical Stress.name")
        .clear()
        .type("#Physical Stress");
      Fari.get("scene.aspect.0.stressTrack.Mental Stress.name")
        .clear()
        .type("#Mental Stress");
      Fari.get("scene.aspect.0.stressTrack.....remove").click();

      // aspect consequences
      Fari.get("scene.aspect.0.consequence.Consequence  (2).name")
        .clear()
        .type("#Consequence (2)");

      Fari.get("scene.aspect.0.consequence.Consequence  (4).remove").click();

      // sort
      Fari.get("scene.sort").click();
      Fari.get("scene.sort").click();

      // remove second
      Fari.get("scene.aspect.1.menu").click();
      Fari.get("scene.aspect.1.menu.reset").click();
      Fari.get("scene.aspect.1.menu.remove").click();

      // initiative
      Fari.get("scene.aspect.1.initiative").click();
      Fari.get("scene.aspect.2.initiative").click();
      Fari.get("scene.aspect.2.initiative").click();

      // pin
      Fari.get("scene.aspect.1.pin").click();

      // reset
      Fari.get("scene.reset").click();

      // set fields again
      Fari.get("scene.name").type("Ba Sing Se");
      Fari.get("scene.group").type("Avatar");
      Fari.get("scene.aspect.0.title").type("NPC after reset");

      // save
      Fari.waitContentEditable();
      Fari.get("scene.save").click();

      // delete
      Fari.get("page.menu.scenes").click();
      Fari.get("manager.delete").click();

      cy.contains("Avatar").should("not.exist");
      cy.contains("Ba Sing Se").should("not.exist");

      // should be back to home page
      cy.url().should("eq", "http://localhost:1234/");

      // undo
      cy.contains("Undo").click();
      cy.contains("Avatar");
      cy.contains("Ba Sing Se").click();

      // new scene
      Fari.get("page.menu.scenes").click();
      Fari.get("manager.new").click();

      // add badguy and pin it
      Fari.get("scene.add-bad-guy").click();
      Fari.get("scene.aspect.0.title").type("Dai Li");
      Fari.get("scene.aspect.0.pin").click();

      // set new field
      Fari.get("scene.name").clear().type("Lower Ring");

      // save
      Fari.waitContentEditable();
      Fari.get("scene.save").click();

      // test menu
      Fari.get("page.menu.scenes").click();
      cy.contains("Avatar");
      cy.contains("Ba Sing Se");
      cy.contains("Lower Ring");

      // close menu
      Fari.closeDrawer();
    });
  });
});
