import DataApi from "./dataApi";

const baseUrl = "/review-report/";

const statusMap = {
    0 : 'New',
    1 : 'Approved',
    2 : 'Denied',
};

class ReviewReportService {

    static getAll() {
        return DataApi.get(baseUrl);
    }

    static get(id) {
        return DataApi.get(baseUrl + id);
    }

    static create(data) {
        return DataApi.post(baseUrl, this.prepareUpdateData(data));
    }

    static update(id, data) {
        return DataApi.put(baseUrl + id, this.prepareUpdateData(data));
    }

    static delete(id) {
        return DataApi.delete(baseUrl + id);
    }

    static prepareUpdateData(data) {
        return {
            comment: data.comment,
            review: data.review.id,
            status: data.status
        }
    }

    static getStatusName(status) {
        return statusMap[status];
    }

    static getAllStatuses() {
        return statusMap;
    }
}
export default ReviewReportService;
