import JwtDecode from 'jwt-decode'
import cookie from 'react-cookies'

import { routes, storage } from '../../src/parameters'

Cypress.on('window:before:load', (win) => {
    fetch('https://unpkg.com/unfetch/dist/unfetch.umd.js')
        .then((stream) => stream.text())
        .then((response) => {
            win.eval(response)
            // eslint-disable-next-line no-param-reassign
            win.fetch = win.unfetch
        })
})

Cypress.Commands.add('stubAllRequests', () => {
    cy.server()

    cy.route({ method: 'GET', url: /.*/, response: {} })
    cy.route({ method: 'POST', url: /.*/, response: {} })
    cy.route({ method: 'POST', url: '/api/igdb/games', response: 'fixture:Game/list.json' })
    cy.route({ method: 'POST', url: '/api/user/', response: 'fixture:User/paginatedList.json' })
    cy.route({ method: 'POST', url: '/api/auth/reset-password-check/token', response: {} })
    cy.route({ method: 'PATCH', url: /.*/, response: {} })
    cy.route({ method: 'PUT', url: /.*/, response: {} })
    cy.route({ method: 'DELETE', url: /.*/, response: {} })
})

Cypress.Commands.add('login', () => {
    const token =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1ODgwODgxOTUsImV4cCI6MTU4ODE3NDU5NSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoia2xha2FsYXNhczIiLCJpZCI6IjVhN2ZjZDU1LTg0OTktMTFlYS1iNDgwLThjMTY0NTgzY2Q1ZCIsImVtYWlsIjoia2xha2FsYXNhczJAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoiRWltYW50YXMiLCJsYXN0TmFtZSI6bnVsbCwiY3JlYXRlZEF0Ijp7ImRhdGUiOiIyMDIwLTA0LTIyIDE2OjAxOjE3LjAwMDAwMCIsInRpbWV6b25lX3R5cGUiOjMsInRpbWV6b25lIjoiRXVyb3BlXC9WaWxuaXVzIn0sImF2YXRhciI6bnVsbH0.UqclFw9jU0n8gpPBLLVFRuwBEW_tg2mdWKqN2VW0YLV6M-SBebdSMXzE6ntbXF1NnvWoUsjwT2nroenPNXtit6WXd16DyIicGreUKIQ6GiowQeGIlDD3DblfNUNmpz5H8MkZHR_5OAJF-osAoL_oBUrDlmeKwed8MYHQcYECGa40MGIioec32TOBLDGdLEaIR0wP7JGd_uGDeOIcVA2IDuezcSKYyMzaDeESTxOHUqE9jd2o6ueMTf2MqRe78mgoGnnnxQeCwwh8Hf9-tbmy_d7GwH7k6SypbujgeUn1DP9hl8ysYncbqGcPI7qhVw1aN4K6AxS_oEi1D12LfIcCfg'
    const currentUser = JwtDecode(token)
    const expires = new Date('+ 1 day')

    currentUser.accessToken = token
    cookie.save(storage.user, currentUser.username, { expires, path: routes.homePage })
    window.localStorage.setItem(currentUser.username, JSON.stringify(currentUser))
})
