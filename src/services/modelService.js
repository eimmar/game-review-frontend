import DataApi from "./dataApi";

class ModelService {

    static getAll() {
        return DataApi.get('/api/model/');
    }

    static getAllByBrand(brandId) {
        return DataApi.get('/api/model/brand/' + brandId)
    }
}
export default ModelService;
