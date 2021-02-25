import { Fari } from "lib/util/Fari";

describe("/srds/condensed", () => {
  it("should be able to navigate using the TOCs", () => {
    Fari.start();
    ["/srds/condensed", "/fate-stunts", "/success-with-style"].forEach(
      (page) => {
        Fari.visit(page);

        // Open all categories
        Fari.get("doc.side-bar.category")
          .each((category) => {
            Fari.getAttribute(cy.wrap(category), "data-cy-open").then(
              (open) => {
                if (open !== "true") {
                  cy.log(`Opening: ${category.text()}`);
                  cy.wrap(category).click({ force: true });
                }
              }
            );
          })
          .then(() => {
            Fari.get("doc.side-bar.category-item").each((item) => {
              cy.log(`Going to: ${item.text()}`);
              cy.wrap(item).click({ force: true });

              Fari.getAttribute(cy.wrap(item), "data-cy-item-id").then((id) => {
                cy.get(`#${id}`).should("be.visible");
              });
            });
          });
      }
    );
  });
});

describe("/srds/accelerated", () => {
  it("should be able to navigate using the buttons", () => {
    Fari.start();
    Fari.visit("/srds/accelerated");

    for (let i = 0; i < 11; i++) {
      Fari.get("doc.next").first().click();
    }
    for (let i = 0; i < 11; i++) {
      Fari.get("doc.previous").first().click();
    }
  });
});
