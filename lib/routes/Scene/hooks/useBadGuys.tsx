import { IScene } from "../../../types/IScene";
import { IBadGuy } from "../../../types/IBadGuy";
import uuid from "uuid/v4";
import { useState } from "react";

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
