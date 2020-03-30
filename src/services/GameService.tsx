import DataApi from './DataApi'
import Slugifier from './Util/Slugifier'

const baseUrl = '/vehicle/'

class VehicleService {
    static getAll() {
        return DataApi.get(baseUrl)
    }

    static get(id: string) {
        return DataApi.get(baseUrl + id)
    }

    static create(data: string) {
        return DataApi.post(baseUrl, data)
    }

    static update(id: string, data: string) {
        return DataApi.put(baseUrl + id, data)
    }

    static delete(id: string) {
        return DataApi.delete(baseUrl + id)
    }

    static slugify(vehicle: object) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const { brand, model } = vehicle

        return Slugifier.slugify(`${brand}-${model}`)
    }
}

export default VehicleService
