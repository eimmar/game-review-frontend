Cypress.Commands.add('stubAllRequests', () => {
    cy.server()

    cy.route({ method: 'GET', url: /.*/, response: {} })
    cy.route({ method: 'POST', url: /.*/, response: {} })
    cy.route({ method: 'PATCH', url: /.*/, response: {} })
    cy.route({ method: 'PUT', url: /.*/, response: {} })
    cy.route({ method: 'DELETE', url: /.*/, response: {} })
})
