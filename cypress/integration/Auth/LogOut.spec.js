import { routes } from '../../../src/parameters'

context('Log Out', () => {
    it('logout', () => {
        cy.login()

        cy.visit('/')

        cy.get('[data-id=profile-menu]').click()
        cy.get('[data-id=logout]').click()

        cy.url().should('eq', Cypress.config().baseUrl + routes.homePage)
        cy.get('[data-id=register]').should('be.visible')
    })
})
