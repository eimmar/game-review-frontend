import Slugifier from './Util/Slugifier'
import { dataApi } from './DataApi'

const baseUrl = '/vehicle/'

class GameService {
    getAll() {
        return dataApi.get(baseUrl)
    }

    get(id: string) {
        return dataApi.get(baseUrl + id)
    }

    create(data: string) {
        return dataApi.post(baseUrl, data)
    }

    update(id: string, data: string) {
        return dataApi.put(baseUrl + id, data)
    }

    delete(id: string) {
        return dataApi.delete(baseUrl + id)
    }

    slugify(vehicle: object) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const { brand, model } = vehicle

        return Slugifier.slugify(`${brand}-${model}`)
    }
}

export const gameService = new GameService()
