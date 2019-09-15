import DataApi from "./dataApi";

class VehicleService {

    static getAll() {
        return DataApi.get('/api/vehicle/');
    }

}
export default VehicleService;
