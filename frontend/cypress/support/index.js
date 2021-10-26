// Before each test, sign on to ping if necessary
beforeEach(() => {
    cy.visit("/", {
        timeout: 60000
    });
    cy.get("#username").then((element) => {
        let name = element.attr("name")
        if (name == "pf.username") {
            cy.get("#username").type(Cypress.env("e2eTestUsername"), {
                log: false
            });
            cy.get("#password").type(Cypress.env("e2eTestPassword"), {
                log: false
            });
            cy.get("#loginButton").click();
        }
    });
});