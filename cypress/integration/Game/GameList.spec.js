import { routes } from '../../../src/parameters'

context('GameList', () => {
    it('Game List', () => {
        cy.route({ method: 'POST', url: '/api/igdb/games', response: 'fixture:Game/list.json' }).as('list')

        cy.visit(routes.homePage)

        cy.get('input[name=query]').type('half life')
        cy.get('form[name=game-search]')
            .find('button')
            .click()

        cy.wait('@list')
        cy.get('[data-id=game]').should('have.length', 11)
        cy.get('[data-id=reset-filters]').should('be.visible')

        cy.get('input[name=ratingFrom]').type(50)

        cy.wait('@list')
        cy.get('[data-id=reset-filters]').should('be.visible')

        cy.get('[data-id=reset-filters]').click()

        cy.wait('@list')
        cy.get('[data-id=reset-filters]').should('not.be.visible')
        cy.get('input[name=query]').should('have.value', '')
        cy.get('input[name=ratingFrom]').should('have.value', '')
    })
})
