import { Fari } from "lib/util/Fari";

describe("/oracle", () => {
  describe("Given I want to ask a question to the oracle", () => {
    it("should ask questions to the oracle ", () => {
      Fari.start();
      Fari.getByText("Consult the Oracle").click();

      askOracle();

      Fari.get("oracle.likeliness.2").click();

      askOracle();

      Fari.get("oracle.likeliness.-2").click();

      askOracle();
    });
  });

  function askOracle() {
    Fari.get("dice").click();

    Fari.get("oracle.value")
      .invoke("attr", "data-cy-value")
      .should("be.oneOf", ["YesAnd", "Yes", "YesBut", "No", "NoAnd"]);
  }
});
