import DataApi from './DataApi'

const baseUrl = '/review-report/'

enum ReviewReportStatus {
    New,
    Approved,
    Denied,
}

const statusMap = {
    '0': 'New',
    '1': 'Approved',
    '2': 'Denied',
}

class ReviewReportService {
    static getAll() {
        return DataApi.get(baseUrl)
    }

    static get(id: string) {
        return DataApi.get(baseUrl + id)
    }

    static create(data: any) {
        return DataApi.post(baseUrl, this.prepareUpdateData(data))
    }

    static update(id: string, data: any) {
        return DataApi.put(baseUrl + id, this.prepareUpdateData(data))
    }

    static delete(id: string) {
        return DataApi.delete(baseUrl + id)
    }

    static prepareUpdateData(data: any) {
        return {
            comment: data.comment,
            review: data.review.id,
            status: data.status,
        }
    }

    static getStatusName(status: ReviewReportStatus) {
        return statusMap[status]
    }

    static getAllStatuses() {
        return statusMap
    }
}

export default ReviewReportService
