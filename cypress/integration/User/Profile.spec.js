import { routes } from '../../../src/parameters'

context('Profile', () => {
    beforeEach(() => {
        cy.route({ method: 'GET', url: '/api/game-list/user/**', response: 'fixture:GameList/list.json' })
    })

    it('Profile view', () => {
        cy.login()
        cy.visit('/')
        cy.get('[data-id=profile-menu]').click()
        cy.get('[data-id=profile]').click()
        cy.get('[data-id=game-list-tabs]')
            .children()
            .should('have.length', 4)
    })

    it('List reviews', () => {
        cy.login()
        cy.route({ method: 'POST', url: '/api/review/user/**', response: 'fixture:Review/paginatedList.json' }).as(
            'list',
        )

        cy.visit(routes.user.profile)
        cy.get('[data-id=reviews]').click()

        cy.wait('@list')
        cy.get('ul > div').should('have.length', 2)
    })

    it('Update review', () => {
        cy.login()
        cy.route({ method: 'POST', url: '/api/review/user/**', response: 'fixture:Review/paginatedList.json' }).as(
            'list',
        )
        cy.route({ method: 'POST', url: '/api/review/edit/**', response: 'fixture:Review/editResponse.json' }).as(
            'edit',
        )

        cy.visit(routes.user.profile)
        cy.get('[data-id=reviews]').click()

        cy.wait('@list')
        cy.get('[data-id=edit]')
            .first()
            .click()
        cy.get('input[name=title]')
            .should('be.visible')
            .type('Headline')
        cy.get('[data-id=review-submit]').click()

        cy.wait('@edit')
        cy.get('div[role=alert]').should('be.visible')
        cy.get('ul > div > h6')
            .first()
            .should('contain.text', 'Headline')
    })

    it('Delete review', () => {
        cy.login()
        cy.route({ method: 'POST', url: '/api/review/user/**', response: 'fixture:Review/paginatedList.json' }).as(
            'list',
        )
        cy.route({ method: 'DELETE', url: '/api/review/**', response: {} }).as('delete')

        cy.visit(routes.user.profile)
        cy.get('[data-id=reviews]').click()

        cy.wait('@list')

        cy.get('[data-id=delete]')
            .first()
            .click()

        cy.get('div[role=dialog]').should('be.visible')

        cy.get('div[role=dialog] button')
            .first()
            .click()

        cy.wait('@delete')
        cy.get('div[role=alert]').should('be.visible')
        cy.get('ul > div').should('have.length', 1)
    })
})
