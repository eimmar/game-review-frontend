import { routes } from '../../../src/parameters'

context('UserView', () => {
    it('User View', () => {
        cy.login()
        cy.route({ method: 'POST', url: '/api/user/', response: 'fixture:User/paginatedList.json' }).as('list')
        cy.route({ method: 'GET', url: '/api/user/**', response: 'fixture:User/viewResponse.json' }).as('view')
        cy.route({ method: 'GET', url: '/api/game-list/user/**', response: 'fixture:User/viewResponse.json' })
        cy.route({
            method: 'GET',
            url: '/api/friendship/get/**',
            response: 'fixture:Friendship/notFriendsResponse.json',
        }).as('friends')

        cy.visit('/')
        cy.get(`a[href="${routes.user.list}"]`).click()

        cy.wait('@list')
        cy.get('[data-id=user] a > h2')
            .first()
            .click()

        cy.wait('@view')
        cy.wait('@friends')

        cy.get('[data-id=add]').should('be.visible')
    })
})
