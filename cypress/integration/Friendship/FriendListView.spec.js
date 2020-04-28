import { routes } from '../../../src/parameters'

context('FriendList', () => {
    it('Friend List', () => {
        cy.route({
            method: 'POST',
            url: '/api/friendship/',
            response: 'fixture:Friendship/friendsPaginatedList.json',
        }).as('list')

        cy.route({
            method: 'GET',
            url: '/api/friendship/remove/**',
            response: {},
        }).as('remove')

        cy.login()
        cy.visit(routes.homePage)
        cy.get('[data-id=profile-menu]').click()
        cy.get('[data-id=friendList]').click()

        cy.wait('@list')
        cy.get('[data-id=friendship]').should('have.length', 2)
        cy.get('[data-id=remove]').should('have.length', 2)

        cy.get('[data-id=remove]')
            .first()
            .click()

        cy.get('div[role=dialog]').should('be.visible')
        cy.get('div[role=dialog] button')
            .first()
            .click()

        cy.wait('@remove')
        cy.get('div[role=alert]').should('be.visible')
        cy.get('[data-id=friendship]').should('have.length', 1)
    })
})
