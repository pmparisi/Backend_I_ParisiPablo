import productModel from "./models/product.model.js";

class ProductManager {
    async addProduct(product){
            const savedProduct = await productModel.create(product);
            return savedProduct._id ? savedProduct._id : -1;
    }

    async getProducts(params = {}) {
        const paginate = {
            page: params.page ? parseInt(params.page) : 1,
            limit: params.limit ? parseInt(params.limit) : 10,
            lean: true
        };   
        const result = await productModel.paginate({}, paginate);
        return result;
    }

    async getAllProducts() {
        const products = await productModel.find({});
        return products;
    }

    async getProductById(id) {
        const product = await productModel.findOne({ _id: id });
        if (!product) return { error: 'product_not_found' };
        return product;
    }

    async updateProduct(id, updates) {
        const updatedProduct = await productModel.updateOne({ _id: id }, { $set: updates });
        if (updatedProduct.n === 0) return { error: 'product_not_found' };
        if (updatedProduct.nModified === 0) return -1;
        return true;
    }

    async deleteProduct(id){
        const result = await productModel.deleteOne({ _id: id });
        if (result.deletedCount === 0) return { error: 'product_not_found' };
        return true;        
    }
};

export default ProductManager;