import { routes } from '../../../src/parameters'

context('ResetPassword', () => {
    it('Reset password', () => {
        cy.route({
            method: 'POST',
            url: '/api/auth/reset-password/token',
            response: {},
        }).as('resetPassword')

        cy.wait(1000)

        cy.visit(`${routes.resetPassword}/token`)

        cy.get('input[name=password]').type('password')
        cy.get('input[name=repeatPassword]').type('password')
        cy.get('button[id=reset-password-submit]').click()

        cy.wait('@resetPassword')
        cy.url().should('contain', routes.login)
        cy.get('div[role=alert]').should('be.visible')
    })
})
