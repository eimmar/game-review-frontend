import cookie from 'react-cookies'

import { backendUrl } from '../parameters'
import { errorService } from './ErrorService'
// eslint-disable-next-line import/no-cycle
import { authService } from './AuthService'

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

export interface Pagination {
    page: number
    totalResults: number
    pageSize: number
}

export interface PaginatedList<T> {
    page: number
    totalResults: number
    pageSize: number
    items: T[]
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
        const currentUser = authService.getCurrentUser()

        const requestOptions: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                ...(currentUser && { Authorization: `Bearer ${currentUser.accessToken}` }),
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
