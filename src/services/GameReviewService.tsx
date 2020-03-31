import { dataApi } from './DataApi'

const baseUrl = '/review/'

class ReviewService {
    getAll() {
        return dataApi.get(baseUrl)
    }

    get(id: string) {
        return dataApi.get(baseUrl + id)
    }

    getByVehicle(vehicleId: string) {
        return dataApi.get(`${baseUrl}vehicle/${vehicleId}`)
    }

    create(data: any) {
        return dataApi.post(baseUrl, this.prepareReviewData(data))
    }

    update(id: string, data: any) {
        return dataApi.put(baseUrl + id, this.prepareReviewData(data))
    }

    delete(id: string) {
        return dataApi.delete(baseUrl + id)
    }

    prepareReviewData(data: any) {
        return {
            comment: data.comment,
            vehicle: data.vehicle.id,
            rating: data.rating,
        }
    }
}

export const reviewService = new ReviewService()
