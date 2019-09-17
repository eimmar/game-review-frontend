import DataApi from "./dataApi";

const baseUrl = "/review/";

class ReviewService {

    static getAll() {
        return DataApi.get(baseUrl);
    }

    static get(id) {
        return DataApi.get(baseUrl + id);
    }

    static getByVehicle(vehicleId) {
        return DataApi.get(baseUrl + 'vehicle/' + vehicleId);
    }

    static create(data) {
        return DataApi.post(baseUrl, data);
    }

    static update(id, data) {
        return DataApi.put(baseUrl + id, data);
    }

    static delete(id) {
        return DataApi.delete(baseUrl + id);
    }
}
export default ReviewService;
