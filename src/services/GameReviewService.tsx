import DataApi from './DataApi';

const baseUrl = '/review/';

class ReviewService {
    static getAll() {
        return DataApi.get(baseUrl);
    }

    static get(id: string) {
        return DataApi.get(baseUrl + id);
    }

    static getByVehicle(vehicleId: string) {
        return DataApi.get(`${baseUrl}vehicle/${vehicleId}`);
    }

    static create(data: any) {
        return DataApi.post(baseUrl, this.prepareReviewData(data));
    }

    static update(id: string, data: any) {
        return DataApi.put(baseUrl + id, this.prepareReviewData(data));
    }

    static delete(id: string) {
        return DataApi.delete(baseUrl + id);
    }

    static prepareReviewData(data: any) {
        return {
            comment: data.comment,
            vehicle: data.vehicle.id,
            rating: data.rating,
        };
    }
}

export default ReviewService;
