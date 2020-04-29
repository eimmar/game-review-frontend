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
        cy.route({ method: 'POST', url: '/api/game-list/**/remove/**', response: 'fixture:GameList/single.json' }).as(
            'remove',
        )

        cy.get('[data-id=game-lists] .MuiIconButton-colorPrimary').click()
        cy.wait('@remove')
        cy.get('[data-id=game-lists] .MuiIconButton-colorPrimary').should('not.be.visible')
    })

    it('Add to predefined list', () => {
        cy.route({ method: 'POST', url: '/api/game-list/**/add/**', response: 'fixture:GameList/single.json' }).as(
            'add',
        )

        cy.get('[data-id=game-lists] .MuiIconButton-colorInherit')
            .first()
            .click()
        cy.wait('@add')
        cy.get('[data-id=game-lists] .MuiIconButton-colorPrimary').should('have.length', 2)
    })

    it('Create custom list', () => {
        cy.route({ method: 'POST', url: '/api/game-list/new', response: 'fixture:GameList/single.json' }).as('create')

        cy.get('[data-id=game-lists] button')
            .last()
            .click()
        cy.get('div[role=dialog]').should('be.visible')
        cy.get('div[role=dialog] button')
            .first()
            .click()
        cy.get('input[name=name]').type('Custom')
        cy.get('div[role=dialog] button')
            .first()
            .click()

        cy.wait('@create')
        cy.get('div[role=alert]').should('be.visible')
        cy.get('div[role=dialog] ul > div').should('have.length', 2)
        cy.get('div[role=dialog] button')
            .last()
            .click()
        cy.get('div[role=dialog]').should('not.be.visible')
    })

    it('Toggle game in custom list', () => {
        cy.route({
            method: 'POST',
            url: '/api/game-list/**/add/**',
            response: 'fixture:Game/GameListTab/customResponse2.json',
        }).as('add')
        cy.route({
            method: 'POST',
            url: '/api/game-list/**/remove/**',
            response: 'fixture:Game/GameListTab/customResponse2.json',
        }).as('remove')

        cy.get('[data-id=game-lists] button')
            .last()
            .click()
        cy.get('input[type=checkbox]').check()
        cy.wait('@add')
        cy.get('div[role=alert]').should('be.visible')
        cy.get('input[type=checkbox]').should('be.checked')

        cy.get('input[type=checkbox]').uncheck()
        cy.wait('@remove')
        cy.get('div[role=alert]')
            .should('be.visible')
            .should('have.length', 2)
        cy.get('input[type=checkbox]').should('not.be.checked')

        cy.get('div[role=dialog] button')
            .last()
            .click()
        cy.get('div[role=dialog]').should('not.be.visible')
    })

    it('Write a review', () => {
        cy.route({ method: 'POST', url: '/api/review/new', response: 'fixture:Review/editResponse.json' }).as('new')

        cy.get('[data-id=create-review]').click()
        cy.get('div[role=dialog]').should('be.visible')

        cy.get('input[name=title]').type('title')
        cy.get('label[for=rating-9]').click()
        cy.get('textarea[name=comment]').type('comment')
        cy.get('[data-id=pros] button').click()
        cy.get('input[name="pros.0"]').type('pro')
        cy.get('[data-id=cons] button').click()
        cy.get('input[name="cons.0"]').type('con')

        cy.get('div[role=dialog] button')
            .last()
            .click()

        cy.wait('@new')
        cy.get('div[role=dialog]').should('not.be.visible')
        cy.get('div[role=alert]').should('be.visible')
    })

    it('Should redirect to login when unauthenticated user tries to add game to list', () => {
        cy.logout()
        cy.get('[data-id=game-lists] .MuiIconButton-colorInherit')
            .first()
            .click()

        cy.url().should('contain', routes.login)
    })

    it('Should redirect to login when unauthenticated user tries to open review modal', () => {
        cy.logout()
        cy.get('[data-id=create-review]').click()

        cy.url().should('contain', routes.login)
    })
})
