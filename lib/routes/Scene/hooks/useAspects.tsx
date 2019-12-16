import { IScene } from "../../../types/IScene";
import { googleAnalyticsService } from "../../../services/injections";

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
    googleAnalyticsService.sendEvent({
      category: "SceneAspect",
      action: "Create"
    });
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
    googleAnalyticsService.sendEvent({
      category: "SceneAspect",
      action: "Update"
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
    googleAnalyticsService.sendEvent({
      category: "SceneAspect",
      action: "Delete"
    });
  }

  return {
    addAspectToScene,
    updateAspectInScene,
    removeAspectFromScene
  };
}
