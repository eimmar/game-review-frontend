import DataApi from "./dataApi";
import Slugifier from "../utils/slugifier";

class VehicleService {

    static getAll() {
        return DataApi.get('/api/vehicle/');
    }

    static slugify(vehicle) {
        return Slugifier.slugify(vehicle.brand + '-' + vehicle.model);
    }
}
export default VehicleService;
