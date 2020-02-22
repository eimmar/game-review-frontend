import Axios from 'axios';

// eslint-disable-next-line import/no-cycle
import AuthService from './AuthService';
import { backendUrl } from '../parameters';

class DataApi {
    static get(path: string, params?: any) {
        const config = AuthService.getAuthHeaders();

        return Axios.get(backendUrl + path, { ...config, data: params });
    }

    static post(path: string, params?: any) {
        return Axios.post(backendUrl + path, params, AuthService.getAuthHeaders());
    }

    static put(path: string, params?: any) {
        return Axios.put(backendUrl + path, params, AuthService.getAuthHeaders());
    }

    static delete(path: string, params?: any) {
        const config = AuthService.getAuthHeaders();

        return Axios.delete(backendUrl + path, { ...config, data: params });
    }
}

export default DataApi;
