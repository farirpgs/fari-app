import { Fari } from "lib/util/Fari";

describe("/srds/condensed", () => {
  it("should be able to navigate using the TOCs", () => {
    Fari.start();
    Fari.visit("/srds/condensed");

    // Navigate All H1
    Fari.get("doc.table-of-content.h1").each(($h1) => {
      // Open H1
      cy.wrap($h1).click();

      Fari.getAttribute(cy.wrap($h1), "data-cy-page-id").then((id) => {
        // Verify H1 content is in page
        cy.get(`#${id}`).should("be.visible");

        // Find H2s
        Fari.get(`doc.table-of-content.${id}.h2s`).then(($h2Collapse) => {
          $h2Collapse
            .find(`[data-cy='doc.table-of-content.h2']`)
            .each((index, $h2) => {
              // Navigate All h2
              cy.wrap($h2).click({ force: true });
              Fari.getAttribute(cy.wrap($h2), "data-cy-page-id").then((id) => {
                // Verify H2 content is in page
                cy.get(`#${id}`).should("be.visible");
              });
            });
        });
      });
    });
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
