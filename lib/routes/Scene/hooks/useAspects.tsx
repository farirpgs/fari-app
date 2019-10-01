import { IScene } from "../../../types/IScene";

export type IAspectsManager = ReturnType<typeof useAspects>;

export function useAspects(
  setScene: React.Dispatch<React.SetStateAction<IScene>>
) {
  function addAspectToScene() {
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

  function updateAspectInScene(content: string, index: number) {
    setScene((scene: IScene) => {
      const aspectCopy = [...(scene.aspects || [])];
      aspectCopy[index] = content;
      return {
        ...scene,
        aspects: aspectCopy
      };
    });
  }

  function removeAspectFromScene(indexToRemove: number) {
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
    addAspectToScene,
    updateAspectInScene,
    removeAspectFromScene
  };
}
