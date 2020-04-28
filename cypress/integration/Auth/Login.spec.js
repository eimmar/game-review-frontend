import { routes } from '../../../src/parameters'

context('Login', () => {
    it('login', () => {
        cy.visit(routes.login)

        cy.route({
            method: 'POST',
            url: '/api/auth/login',
            response: 'fixture:Auth/Login/response.json',
        }).as('authLogin')

        cy.get('input[name=username]').type('username')
        cy.get('input[name=password]').type('password')

        cy.get('button[id=login-submit]').click()

        cy.wait('@authLogin')
        cy.url().should('eq', Cypress.config().baseUrl + routes.homePage)
        cy.get('div[role=alert]').should('be.visible')
    })
})
