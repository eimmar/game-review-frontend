import { routes } from '../../../src/parameters'

context('ForgotPassword', () => {
    it('Forgot password', () => {
        cy.visit(routes.forgotPassword)

        cy.route({
            method: 'POST',
            url: '/api/auth/forgot-password',
            response: {},
        }).as('api')

        cy.get('input[name=email]').type('email@gmail.com')
        cy.get('button[id=forgot-password-submit]').click()

        cy.wait('@api')
        cy.url().should('eq', Cypress.config().baseUrl + routes.homePage)
        cy.get('div[role=alert]').should('be.visible')
    })
})
