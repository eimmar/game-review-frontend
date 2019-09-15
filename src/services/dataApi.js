import axios from 'axios';

const baseUrl = 'http://localhost:8000';

class DataApi {

    static get(path, params) {
        return axios.get(baseUrl + path, params);
    }

    static post(path, params) {
        return axios.post(baseUrl + path, params);
    }

    static put(path, params) {
        return axios.put(baseUrl + path, params);
    }

    static delete(path, params) {
        return axios.delete(baseUrl + path, params);
    }
}
export default DataApi;
