import { IScene } from "../../../types/IScene";
import { IBadGuy } from "../../../types/IBadGuy";
import uuid from "uuid/v4";
import { useState } from "react";

export function useBadGuys(
  setScene: React.Dispatch<React.SetStateAction<IScene>>
) {
  const [isBadGuyModalOpened, setIsBadGuyModalOpened] = useState(false);
  const [badGuyToModify, setBadGuyToModify] = useState<IBadGuy>(undefined);

  function addBadGuy(updatedBadGuy: IBadGuy) {
    setScene(scene => {
      return {
        ...scene,
        badGuys: [...scene.badGuys, { ...updatedBadGuy, id: uuid() }]
      };
    });
  }

  function updateBadGuy(updatedBadGuy: IBadGuy) {
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

  function removeBadGuy(updatedBadGuy: IBadGuy) {
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
        addBadGuy(updatedBadGuy);
      } else {
        updateBadGuy(updatedBadGuy);
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
    addBadGuy,
    updateBadGuy,
    removeBadGuy
  };
}
