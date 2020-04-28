import { routes } from '../../../src/parameters'

context('FriendInvitesView', () => {
    it('Friend invites list', () => {
        cy.route({
            method: 'POST',
            url: '/api/friendship/',
            response: 'fixture:Friendship/pendingPaginatedList.json',
        }).as('list')

        cy.route({
            method: 'GET',
            url: '/api/friendship/accept/**',
            response: {},
        }).as('accept')

        cy.login()
        cy.visit(routes.homePage)
        cy.get('[data-id=profile-menu]').click()
        cy.get('[data-id=friendInvites]').click()

        cy.wait('@list')
        cy.get('[data-id=friendship]').should('have.length', 2)
        cy.get('[data-id=pending]').should('have.length', 1)
        cy.get('[data-id=accept]').should('have.length', 1)

        cy.get('[data-id=accept]')
            .first()
            .click()

        cy.wait('@accept')
        cy.get('div[role=alert]').should('be.visible')
        cy.get('[data-id=accept]').should('have.length', 0)
        cy.get('[data-id=pending]').should('have.length', 1)
    })
})
