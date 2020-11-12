export const Fari = {
  start() {
    cy.visit("/");
    this.get("cookie-consent").click();
  },
  get(tag: string) {
    return cy.get(`[data-cy='${tag}']`);
  },
  waitContentEditable() {
    const contentEditableDelay = 300;

    cy.wait(contentEditableDelay + 100);
  },
};
