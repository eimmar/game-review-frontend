import DataApi from "./dataApi";
import Slugifier from "../utils/slugifier";

class VehicleService {

    static getAll() {
        return DataApi.get('/api/vehicle/');
    }

    static get(id) {
        return DataApi.get('/api/vehicle/' + id);
    }

    static create(data) {
        return DataApi.post('/api/vehicle/', data);
    }

    static update(id, data) {
        return DataApi.put('/api/vehicle/' + id, data);
    }

    static slugify(vehicle) {
        return Slugifier.slugify(vehicle.brand + '-' + vehicle.model);
    }
}
export default VehicleService;
