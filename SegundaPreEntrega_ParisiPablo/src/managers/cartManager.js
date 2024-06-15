import fs from 'fs';

class CartManager {
    constructor () {
        this.path = './src/files/carts.json';
        this.init();
    }

    async init () {
        if(!fs.existsSync(this.path)) {
            try {
                await fs.promises.writeFile(this.path,JSON.stringify([]));
                console.log('The file carts.json was successfully created.');
            }
            catch (error) {
                console.log('The file carts.json could not be created.', error);
            }
        }
        else {
            console.log('The file carts.json was found.');
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

    async writeData (carts) {
        try {
            await fs.promises.writeFile(this.path,JSON.stringify(carts,null,'\t'));
            return true;
        }
        catch (error) {
            return false;
        }
    }

    async addCart () {
        const newCart = {
            products: []
        }
        const carts = await this.readData();
        if (!carts) return -1;
        newCart.id = carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
        carts.push(newCart);
        const created = await this.writeData(carts);
        if (!created) return -1;
        return newCart.id;
    }

    async getProductByCartId (id) {
        const carts = await this.readData();
        if (!carts) return -1;
        const existingCartId = carts.find(cart => cart.id === id);
        if (!existingCartId) return { error: 'cart_not_found' };
        return existingCartId.products;
    }

    async addProductToCart (cid,pid,quantity) {
        const carts = await this.readData();
        if (!carts) return -1;
        const cart = carts.find(cart => cart.id === cid);
        if (!cart) return { error: 'cart_not_found' };
        const productIndex = cart.products.findIndex(p => p.product === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } 
        else {
            cart.products.push({ product: pid, quantity: quantity });
        }
        const productAdded = await this.writeData(carts);
        if (!productAdded) return -1;
        return true;
    }
}

export default CartManager;