import uuid from "uuid/v4";
import { getCharactersDb } from "../../database/database";
import { ICharacter } from "../../games/IGame";

export class CharacterService {
  public async get(id: string): Promise<ICharacter> {
    return getCharactersDb().get<ICharacter>(id);
  }

  public async getAll(gameSlug: string): Promise<Array<ICharacter>> {
    await getCharactersDb().createIndex({
      index: { fields: ["game"] }
    });

    const result = await getCharactersDb().find({
      selector: {
        game: { $eq: gameSlug }
      }
    });
    return result.docs;
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
    await getCharactersDb().put<ICharacter>(character);
  }

  public async remove(character: ICharacter): Promise<void> {
    await getCharactersDb().remove(character._id, character._rev, {});
  }
}
