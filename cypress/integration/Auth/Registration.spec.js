import { routes } from '../../../src/parameters'

context('Registration', () => {
    it('regster', () => {
        cy.visit(routes.register)

        cy.route({
            method: 'POST',
            url: '/api/auth/register',
            response: {},
        }).as('api')

        cy.get('input[name=email]').type('email@gmail.com')
        cy.get('input[name=username]').type('username')
        cy.get('input[name=firstName]').type('First')
        cy.get('input[name=lastName]').type('Last')
        cy.get('input[name=password]').type('password')

        cy.get('button[id=register-submit]').click()

        cy.wait('@api')
        cy.url().should('eq', Cypress.config().baseUrl + routes.homePage)
        cy.get('div[role=alert]').should('be.visible')
    })
})
