import { IScene } from "../../../types/IScene";

export function useAspects(
  setScene: React.Dispatch<React.SetStateAction<IScene>>
) {
  function addAspect() {
    setScene((scene: IScene) => {
      return {
        ...scene,
        aspects: [...(scene.aspects || []), ""]
      };
    });
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 0);
  }

  function setAspect(content: string, index: number) {
    setScene((scene: IScene) => {
      const aspectCopy = [...(scene.aspects || [])];
      aspectCopy[index] = content;
      return {
        ...scene,
        aspects: aspectCopy
      };
    });
  }

  function removeAspect(indexToRemove: number) {
    setScene((scene: IScene) => {
      return {
        ...scene,
        aspects: scene.aspects.filter(
          (element, currentIndex) => currentIndex !== indexToRemove
        )
      };
    });
  }

  return {
    addAspect,
    setAspect,
    removeAspect
  };
}
