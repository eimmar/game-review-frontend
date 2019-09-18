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
        return DataApi.post(baseUrl, this.prepareReviewData(data));
    }

    static update(id, data) {
        return DataApi.put(baseUrl + id, this.prepareReviewData(data));
    }

    static delete(id) {
        return DataApi.delete(baseUrl + id);
    }

    static prepareReviewData(data) {
        return {
            comment: data.comment,
            vehicle: data.vehicle.id,
            rating: data.rating
        }
    }
}
export default ReviewService;
