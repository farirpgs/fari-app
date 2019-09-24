import uuid from "uuid/v4";
import { getScenesDb } from "../../database/database";
import { IScene } from "../../types/IScene";

export class SceneService {
  public async get(id: string): Promise<IScene> {
    return getScenesDb().get<IScene>(id);
  }

  public async getAll(): Promise<Array<IScene>> {
    const result = await getScenesDb().allDocs({
      include_docs: true
    });
    const scenes = (result.rows.map(row => row.doc) as unknown) as Array<
      IScene
    >;
    return scenes;
  }

  public async add(scene: IScene): Promise<string> {
    const newId = uuid();
    await getScenesDb().put<IScene>({
      _id: newId,
      ...scene
    });
    return newId;
  }

  public async update(scene: IScene): Promise<void> {
    await getScenesDb().put<IScene>(scene);
  }

  public async remove(scene: IScene): Promise<void> {
    await getScenesDb().remove(scene._id, scene._rev, {});
  }
}
