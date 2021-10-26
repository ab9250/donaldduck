//Settings E2E Tests
describe("View Settings", function () {
  it("Settings page renders", function () {
    cy.visit("/settings");
    cy.get("#settings").should("exist");
  });
});
