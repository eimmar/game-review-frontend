import { routes } from '../../../src/parameters'

context('ProfileEdit', () => {
    it('Profile edit', () => {
        cy.route({ method: 'POST', url: '/api/user/edit/**', response: 'fixture:User/editResponse.json' }).as('edit')
        cy.route({ method: 'POST', url: '/api/review/user/**', response: 'fixture:Review/paginatedList.json' })
        cy.login()
        cy.visit(routes.user.profileEdit)
        cy.get('input[name=firstName]').type('NewName')
        cy.get('input[name=lastName]').type('NewLast')
        cy.get('[data-id=submit]').click()

        cy.wait('@edit')
        cy.url().should('contain', routes.user.profile)
        cy.get('div[role=alert]').should('be.visible')
    })
})
