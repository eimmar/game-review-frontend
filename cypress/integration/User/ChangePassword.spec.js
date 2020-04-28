import { routes } from '../../../src/parameters'

context('ChangePassword', () => {
    it('Change password', () => {
        cy.login()

        cy.visit(routes.user.changePassword)

        cy.route({
            method: 'POST',
            url: '/api/auth/change-password/userGuid',
            response: {},
        }).as('api')

        cy.get('input[name=currentPassword]').type('password')
        cy.get('input[name=password]').type('password')
        cy.get('input[name=repeatPassword]').type('password')
        cy.get('button[id=change-password-submit]').click()

        cy.url().should('contain', routes.user.profile)
        cy.get('div[role=alert]').should('be.visible')
    })
})
