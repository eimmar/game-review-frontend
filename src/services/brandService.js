import DataApi from "./dataApi";

class BrandService {

    static getAll() {
        return DataApi.get('/api/brand/');
    }

}
export default BrandService;
