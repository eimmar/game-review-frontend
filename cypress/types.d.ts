declare namespace Cypress {
    interface Chainable {
        stubAllRequests(): void
        login(): void
    }
}
