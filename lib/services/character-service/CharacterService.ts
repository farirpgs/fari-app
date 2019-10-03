import uuid from "uuid/v4";
import { getCharactersDb } from "../../database/database";
import { ICharacter } from "../../types/ICharacter";

export class CharacterService {
  public async get(id: string): Promise<ICharacter> {
    return getCharactersDb().get<ICharacter>(id);
  }

  public async getAllByGame(gameSlug: string): Promise<Array<ICharacter>> {
    await getCharactersDb().createIndex({
      index: { fields: ["game"] }
    });

    const result = await getCharactersDb().find({
      selector: { _id: { $exists: true } }
    });
    return result.docs as Array<ICharacter>;
  }

  public async add(character: ICharacter, gameSlug: string): Promise<string> {
    const newId = uuid();
    await getCharactersDb().put({
      _id: newId,
      ...character,
      game: gameSlug
    });
    return newId;
  }

  public async update(character: ICharacter): Promise<void> {
    const { _rev } = await getCharactersDb().get(character._id);

    const newCharacter: ICharacter = {
      ...character,
      _rev
    };
    await getCharactersDb().put<ICharacter>(newCharacter);
  }

  public async remove(character: ICharacter): Promise<void> {
    await getCharactersDb().remove(character._id, character._rev, {});
  }
}
