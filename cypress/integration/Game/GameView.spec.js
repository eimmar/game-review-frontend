import { routes } from '../../../src/parameters'

context('GameView', () => {
    beforeEach(() => {
        cy.route({ method: 'POST', url: '/api/igdb/games', response: 'fixture:Game/list.json' }).as('list')
        cy.route({ method: 'POST', url: '/api/igdb/game/**', response: 'fixture:Game/single.json' }).as('single')

        cy.route({
            method: 'GET',
            url: '/api/game-list/containing/game/**/user/**',
            response: 'fixture:Game/GameListTab/containingGame.json',
        }).as('containingGame')

        cy.route({
            method: 'GET',
            url: '/api/game-list/user/**',
            response: 'fixture:GameList/list.json',
        }).as('userLists')

        cy.route({
            method: 'POST',
            url: '/api/game-spot/videos/**',
            response: 'fixture:Game/GameSpot/videos.json',
        }).as('gameSpotVideos')

        cy.route({
            method: 'POST',
            url: '/api/review/game/**',
            response: 'fixture:Review/paginatedList.json',
        }).as('userReviews')

        cy.login()
        cy.visit(routes.homePage)

        cy.get('input[name=query]').type('half life')
        cy.get('form[name=game-search]')
            .find('button')
            .click()

        cy.wait('@list')
        cy.get('[data-id=game]')
            .find('a img')
            .first()
            .click()

        cy.wait('@single')
        cy.wait('@containingGame')
        cy.wait('@userLists')
        cy.wait('@gameSpotVideos')
        cy.wait('@userReviews')
    })

    it('Game View', () => {
        cy.get('[data-id=game-lists] button')
            .first()
            .should('have.class', 'MuiIconButton-colorPrimary')
    })

    it('Remove from predefined list', () => {
        // cy.get('[data-id=game-lists] button')
        //     .first()
        //     .should('have.class', 'MuiIconButton-colorPrimary')
    })
})
