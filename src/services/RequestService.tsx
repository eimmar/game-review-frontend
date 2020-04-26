import cookie from 'react-cookies'
import { toast } from 'react-toastify'

import { backendUrl, params, phpDebug, routes, storage } from '../parameters'
import { errorService } from './ErrorService'
// eslint-disable-next-line import/no-cycle
import { authService } from './AuthService'
import history from './History'
import { t } from '../i18n'

export interface Pagination {
    page: number
    totalResults: number
    pageSize: number
}

export interface SearchRequest extends Pagination {
    filters: Filter
}

export interface Filter {
    [key: string]: string | number | undefined
}

export interface PaginatedList<T> extends Pagination {
    items: T[]
}

class RequestService {
    getFilters(search: string): Filter[] {
        return search
            .slice(1)
            .split('&')
            .map((p) => p.split('='))
            .reduce((obj, pair) => {
                // eslint-disable-next-line prefer-const
                let [key, value] = pair.map(decodeURIComponent)

                // eslint-disable-next-line no-prototype-builtins
                if (obj.hasOwnProperty(key) && key !== 'page') {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    const valAsArray = Array.isArray(obj[key]) ? obj[key] : [obj[key].replace(/\+/g, ' ')]

                    valAsArray.push(value)
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    value = [...new Set(valAsArray)]
                } else {
                    value = value ? value.replace(/\+/g, ' ') : value
                }

                return { ...obj, [key]: value }
            }, {}) as Filter[]
    }

    getRequestOptions(method: string, body: BodyInit, contentType: string | null): RequestInit {
        const currentUser = authService.getCurrentUser()

        const requestOptions: RequestInit = {
            method,
            headers: {
                ...(contentType && { 'Content-Type': contentType }),
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
                cookie.remove(storage.user, { path: routes.homePage })
                history.push(routes.login, { referer: { url: history.location.pathname } })
            }

            if (response.status === 206 && !cookie.load(storage.partialContentWarningShown)) {
                toast.warn(t`warning.gamePartialContent`, { autoClose: false, position: 'top-center' })
                cookie.save(storage.partialContentWarningShown, 1, { maxAge: params.partialContentWarningMaxAge })
            }

            if (response.ok) {
                return data
            }

            const error = errorService.getError(response.status, data)

            return Promise.reject(error)
        })
    }

    performRequest(method: 'POST' | 'GET' | 'DELETE', action: string, body?: object) {
        return fetch(
            backendUrl + action + phpDebug,
            this.getRequestOptions(method, body ? JSON.stringify(body) : '', 'application/json;charset=UTF-8'),
        ).then(this.handleResponse)
    }

    performMultiPartRequest(method: 'POST' | 'GET' | 'DELETE', action: string, body: BodyInit) {
        return fetch(backendUrl + action, this.getRequestOptions(method, body, null)).then(this.handleResponse)
    }
}

export const requestService = new RequestService()
