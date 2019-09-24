import { IScene } from "../../types/IScene";
import { defaultArcName } from "./defaultArcName";
import { IGroupedScenes } from "./IGroupedScenes";

function sortSceneAlphabetically(array: Array<IScene>) {
  return [...array].sort((a, b) => a.name.localeCompare(b.name));
}

export function groupScenesByCampaign(scenes: Array<IScene>) {
  const groupedScenes = scenes.reduce(
    (groupedScenes, scene) => {
      const [arcName, sceneName] = scene.name.split("/");
      const hasAnArc = !!sceneName;

      if (hasAnArc) {
        const trimmedArcName = arcName.trim();
        const previousArcScenes = groupedScenes[trimmedArcName] || [];
        const trimmedSceneName = sceneName.trim();
        groupedScenes[trimmedArcName] = [
          ...previousArcScenes,
          { ...scene, name: trimmedSceneName }
        ];
      } else {
        const previousArcScenes = groupedScenes[defaultArcName] || [];
        groupedScenes[defaultArcName] = [...previousArcScenes, scene];
      }
      return groupedScenes;
    },
    {} as IGroupedScenes
  );

  const sortedGroupedScenes = Object.keys(groupedScenes).reduce(
    (sortedGroupedScenes, arcName) => {
      const scenes = groupedScenes[arcName];
      sortedGroupedScenes[arcName] = sortSceneAlphabetically(scenes);
      return sortedGroupedScenes;
    },
    {}
  );

  return sortedGroupedScenes;
}
