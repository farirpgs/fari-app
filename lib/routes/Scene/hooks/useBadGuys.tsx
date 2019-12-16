import { IScene } from "../../../types/IScene";
import { IBadGuy } from "../../../types/IBadGuy";
import uuid from "uuid/v4";
import { useState } from "react";
import { googleAnalyticsService } from "../../../services/injections";

export type IBadGuysManager = ReturnType<typeof useBadGuys>;

export function useBadGuys(
  setScene: React.Dispatch<React.SetStateAction<IScene>>
) {
  const [isBadGuyModalOpened, setIsBadGuyModalOpened] = useState(false);
  const [badGuyToModify, setBadGuyToModify] = useState<IBadGuy>(undefined);

  function addBadGuyToScene(updatedBadGuy: IBadGuy) {
    setScene(scene => {
      return {
        ...scene,
        badGuys: [...scene.badGuys, { ...updatedBadGuy, id: uuid() }]
      };
    });
    googleAnalyticsService.sendEvent({
      category: "SceneBadGuy",
      action: "Create"
    });
  }

  function updateBadGuyInScene(updatedBadGuy: IBadGuy) {
    setScene(scene => {
      return {
        ...scene,
        badGuys: scene.badGuys.map(badGuy => {
          if (updatedBadGuy.id === badGuy.id) {
            return updatedBadGuy;
          }
          return badGuy;
        })
      };
    });
    googleAnalyticsService.sendEvent({
      category: "SceneBadGuy",
      action: "Update"
    });
  }

  function removeBadGuyFromScene(updatedBadGuy: IBadGuy) {
    setScene(scene => {
      return {
        ...scene,
        badGuys: scene.badGuys.filter(badGuy => {
          return badGuy.id !== updatedBadGuy.id;
        })
      };
    });
    googleAnalyticsService.sendEvent({
      category: "SceneBadGuy",
      action: "Delete"
    });
  }

  function onBadGuyDialogClose(updatedBadGuy?: IBadGuy) {
    const shouldUpdateScene = !!updatedBadGuy;
    if (shouldUpdateScene) {
      const isNew = !updatedBadGuy.id;
      if (isNew) {
        addBadGuyToScene(updatedBadGuy);
      } else {
        updateBadGuyInScene(updatedBadGuy);
      }
    }
    setIsBadGuyModalOpened(false);
    setBadGuyToModify(undefined);
  }

  function onAddBadBuyButtonClick() {
    setBadGuyToModify(undefined);
    setIsBadGuyModalOpened(true);
  }

  function onModifyBadBuyButtonClick(badGuy: IBadGuy) {
    setBadGuyToModify(badGuy);
    setIsBadGuyModalOpened(true);
  }

  return {
    isBadGuyModalOpened,
    badGuyToModify,
    onAddBadBuyButtonClick,
    onModifyBadBuyButtonClick,
    onBadGuyDialogClose,
    updateBadGuyInScene,
    removeBadGuyFromScene
  };
}
