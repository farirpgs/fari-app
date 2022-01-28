import { CharacterFactory } from "../CharacterFactory";
import { CharacterTemplates } from "../CharacterType";

describe("CharacterFactory.make", () => {
  it("should make all available templates", async () => {
    // console.log(JSON.stringify(CharacterTemplates, null, 2));
    for (const template of Object.keys(CharacterTemplates)) {
      // const templateKey =
      try {
        await CharacterFactory.make(template as CharacterTemplates);
        // console.log(result);
      } catch (error) {
        console.error(`Could not make template: ${template}`);
        expect(error).toBeUndefined();
      }
    }
  });
});
