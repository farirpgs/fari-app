import produce from "immer";
import { IGM, IIndexCard, IPlayer, IScene } from "../useScene/IScene";
import { IFirebaseSession } from "./useFirebaseSession";

export const SafeFirebaseSession = {
  build(snapshot: any): IFirebaseSession {
    return produce(snapshot as IFirebaseSession, (draft: IFirebaseSession) => {
      makeGMSafe(draft.info.gm);

      draft.info.players = draft.info.players ?? [];
      draft.info.drawAreaObjects = draft.info.drawAreaObjects ?? [];

      makeSceneSafe(draft.scene);
    });

    function makeGMSafe(gm: IGM) {
      gm.npcs = gm.npcs ?? [];
      for (const npc of gm.npcs) {
        npc.rolls = npc.rolls ?? [];
      }

      makePlayerSafe(gm);
    }

    function makePlayerSafe(player: IPlayer) {
      player.rolls = player.rolls ?? [];
      makePlayerCharacterSafe(player);
    }

    function makePlayerCharacterSafe(player: IPlayer) {
      if (player.character) {
        player.character.pages = player.character.pages ?? [];
        for (const page of player.character.pages) {
          page.sections = page.sections ?? { left: [], right: [] };
          page.sections.left = page.sections.left ?? [];
          page.sections.right = page.sections.right ?? [];

          for (const [, sections] of Object.entries(page.sections)) {
            for (const section of sections) {
              section.blocks = section.blocks ?? [];
              for (const block of section.blocks) {
                block.meta = block.meta ?? {};
              }
            }
          }
        }
      }
    }

    function makeSceneSafe(scene: IScene) {
      scene.indexCards = scene.indexCards ?? {
        public: [],
        private: [],
      };
      scene.indexCards.public = scene.indexCards.public ?? [];
      scene.indexCards.private = scene.indexCards.private ?? [];

      for (const [, cards] of Object.entries(scene.indexCards)) {
        for (const card of cards) {
          makeCardSafe(card);
        }
      }
    }

    function makeCardSafe(card: IIndexCard) {
      card.blocks = card.blocks ?? [];
      card.subCards = card.subCards ?? [];

      for (const block of card.blocks) {
        block.meta = block.meta ?? {};
      }

      for (const subCard of card.subCards) {
        makeCardSafe(subCard);
      }
    }
  },
};
