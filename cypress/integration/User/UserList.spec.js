import { routes } from '../../../src/parameters'

context('UserList', () => {
    it('User List', () => {
        cy.route({ method: 'POST', url: '/api/user/', response: 'fixture:User/paginatedList.json' }).as('list')

        cy.visit('/')
        cy.get(`a[href="${routes.user.list}"]`).click()

        cy.wait('@list')
        cy.get('[data-id=user]').should('have.length', 6)
    })
})
