export const Fari = {
  startLeaveCookie() {
    cy.visit("/");
  },
  start() {
    cy.visit("/");
    this.get("cookie-consent").click({ force: true });
  },
  /**
   * Url needs to be in `../../../serve.json`
   * @param url
   */
  visit(url: string) {
    cy.visit(url);
  },
  get(tag: string) {
    return cy.get(`[data-cy='${tag}']`);
  },
  getByText(text: string) {
    return cy.contains(text);
  },
  find(element: Cypress.Chainable, tag: string) {
    return element.find(`[data-cy='${tag}']`);
  },
  getAttribute(element: Cypress.Chainable, attr: string) {
    return element.invoke("attr", attr);
  },
  waitContentEditable() {
    const contentEditableDelay = 750;

    cy.wait(contentEditableDelay + 100);
  },
  closeBackdrop() {
    cy.get(".MuiPopover-root").eq(0).click();
  },
  closeDrawer() {
    cy.get(".MuiBackdrop-root").eq(0).click({ force: true });
  },
  toggleDarkMode() {
    Fari.get("page.toggle-dark-mode").click();
  },
  changeLanguage(language: string) {
    Fari.get("page.menu.languages").click();
    Fari.get("app.languages").select(language);
  },
};
