import DataApi from "./dataApi";

class ModelService {

    static getAll() {
        return DataApi.get('/model/');
    }

    static getAllByBrand(brandId) {
        return DataApi.get('/model/brand/' + brandId)
    }
}
export default ModelService;
