import cookie from 'react-cookies'

import { backendUrl } from '../parameters'
import { errorService } from './ErrorService'

interface RequestOptions {
    method: string
    headers: object
    body?: object
}

export interface FetchRequest {
    page: number
    sizePerPage: number
    sortField: string
    sortOrder: string
    filters: object
}

class RequestService {
    getRequestOptions(method: string, body: BodyInit): RequestInit {
        const requestOptions: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        }

        if (method !== 'GET') {
            requestOptions.body = body
        }

        return requestOptions
    }

    getRequestOptionsWithAuth(method: string, body: BodyInit): RequestInit {
        const userJson = localStorage.getItem(cookie.load('currentUser'))
        const currentUser = JSON.parse(userJson || '')

        const requestOptions: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                Authorization: `Bearer ${currentUser.token}`,
            },
        }

        if (method !== 'GET') {
            requestOptions.body = body
        }

        return requestOptions
    }

    handleResponse(response: Response) {
        return response.text().then((text) => {
            const data = text && JSON.parse(text)

            if (!response.ok && response.status === 401) {
                cookie.remove('currentUser')
                window.location.hash = '#/login'
            }

            if (response.ok) {
                return data
            }

            const error = errorService.getError(data)

            return Promise.reject(error)
        })
    }

    performAuthenticatedRequest(method: 'POST' | 'GET' | 'DELETE', action: string, body?: object) {
        return fetch(
            backendUrl + action,
            this.getRequestOptionsWithAuth(method, body ? JSON.stringify(body) : ''),
        ).then(this.handleResponse)
    }

    performRequest(method: 'POST' | 'GET' | 'DELETE', action: string, body?: object) {
        return fetch(backendUrl + action, this.getRequestOptions(method, body ? JSON.stringify(body) : '')).then(
            this.handleResponse,
        )
    }
}

export const requestService = new RequestService()
