import fs from 'fs';

class ProductManager {
    constructor () {
        this.path = './src/files/products.json';
        this.init();
    }

    async init () {
        if(!fs.existsSync(this.path)) {
            try {
                await fs.promises.writeFile(this.path,JSON.stringify([]));
                console.log('The file products.json was successfully created.');
            }
            catch (error) {
                console.log('The file products.json could not be created.', error);
            }
        }
        else {
            console.log('The file products.json was found.');
        }
    }

    async readData () {
        try {
            const data = await fs.promises.readFile(this.path,'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            return null;
        }
    }

    async writeData (products) {
        try {
            await fs.promises.writeFile(this.path,JSON.stringify(products,null,'\t'));
            return true;
        }
        catch (error) {
            return false;
        }
    }

    async addProduct ({title,description,code,price,status,stock,category,thumbnails}) {
        const newProduct = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        }
        const products = await this.readData();
        if (!products) return -1;
        newProduct.id = products.length === 0 ? 1 : products[products.length - 1].id + 1;
        products.push(newProduct);
        const created = await this.writeData(products);
        if (!created) return -1;
        return newProduct.id;
    }

    async getProducts () {
        return await this.readData();
    }

    async getProductById (id) {
        const product = await this.readData();
        if (!product) return -1;
        const existingProductId = product.find(product => product.id === id);
        if (!existingProductId) return { error: 'product_not_found' };
        return existingProductId;
    }
    
    async updateProduct (id,fieldToUpdate) {
        const products = await this.readData();
        if (!products) return -1;
        const index = products.findIndex(product => product.id === id);
        if (index === -1) return { error: 'product_not_found' };
        products[index] = { ...products[index], ...fieldToUpdate };
        const updated = await this.writeData(products);
        if (!updated) return -1;
        return true;
    }

    async deleteProduct (id) {
        const products = await this.readData();
        if (!products) return -1;
        const index = products.findIndex(product => product.id === id);
        if (index === -1) return { error: 'product_not_found' };
        products.splice(index, 1);
        const delated = await this.writeData(products);
        if (!delated) return -1;
        return true;
    }
}

export default ProductManager;