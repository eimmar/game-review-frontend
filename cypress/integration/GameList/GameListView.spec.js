import { routes } from '../../../src/parameters'

context('GameListView', () => {
    beforeEach(() => {
        cy.route({ method: 'GET', url: '/api/game-list/user/**', response: 'fixture:GameList/list.json' }).as('list')

        cy.login()

        cy.visit(routes.homePage)

        cy.get('[data-id=profile-menu]').click()
        cy.get('[data-id=profile]').click()

        cy.route({ method: 'GET', url: '/api/game-list/**', response: 'fixture:GameList/single.json' }).as('single')
        cy.route({ method: 'POST', url: '/api/game/list/**', response: 'fixture:Game/gameListGames.json' }).as(
            'list-games',
        )

        cy.wait('@list')

        cy.get('[data-id=game-list-tabs] a')
            .first()
            .click()

        cy.wait('@single')
        cy.wait('@list-games')
    })

    it('Game list view', () => {
        cy.get('[data-id=remove-game]').should('have.length', 3)
    })

    it('Game list edit', () => {
        cy.route({ method: 'POST', url: '/api/game-list/edit/**', response: 'fixture:GameList/single.json' }).as('edit')

        cy.get('[data-id=edit]').click()
        cy.get('div[role=dialog]').should('be.visible')
        cy.get('div[role=dialog] button')
            .first()
            .click()

        cy.wait('@edit')
        cy.get('div[role=alert]').should('be.visible')
    })

    it('Game list remove game', () => {
        cy.route({ method: 'POST', url: '/api/game-list/**/remove/**', response: 'fixture:GameList/single.json' }).as(
            'remove',
        )

        cy.get('[data-id=remove-game]')
            .first()
            .click()

        cy.wait('@remove')
        cy.get('div[role=alert]').should('be.visible')
        cy.get('[data-id=remove-game]').should('have.length', 2)
    })

    it('Game list remove', () => {
        cy.route({ method: 'DELETE', url: '/api/game-list/**', response: 'fixture:GameList/single.json' }).as('delete')

        cy.get('[data-id=delete]').click()
        cy.get('div[role=dialog]').should('be.visible')
        cy.get('div[role=dialog] button')
            .first()
            .click()

        cy.wait('@delete')
        cy.get('div[role=alert]').should('be.visible')
        cy.url().should('contain', routes.user.profile)
    })
})
