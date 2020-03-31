import Axios from 'axios'

import { backendUrl } from '../parameters'
import { authService } from './AuthService'

class DataApi {
    get(path: string, params?: any) {
        const config = authService.getAuthHeaders()

        return Axios.get(backendUrl + path, { ...config, data: params })
    }

    post(path: string, params?: any) {
        return Axios.post(backendUrl + path, params, authService.getAuthHeaders())
    }

    put(path: string, params?: any) {
        return Axios.put(backendUrl + path, params, authService.getAuthHeaders())
    }

    delete(path: string, params?: any) {
        const config = authService.getAuthHeaders()

        return Axios.delete(backendUrl + path, { ...config, data: params })
    }
}

export const dataApi = new DataApi()
