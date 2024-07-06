import cartModel from "./models/cart.model.js";

class CartManager {
    async addCart () {
        const newCart = {
            products: []
        };
        const createdCart = await cartModel.create(newCart);
        return createdCart.id ? createdCart.id : -1;
    }

    async addProductToCart (cid, pid, quantity) {
        const existingCart = await cartModel.findOne({ _id: cid });
        if (!existingCart) {
            return { error: 'cart_not_found' };
        }
        const productIndex = existingCart.products.findIndex(p => String(p.product) === String(pid));
        if (productIndex !== -1) {
            existingCart.products[productIndex].quantity += quantity;
        } else {
            existingCart.products.push({ product: pid, quantity: quantity });
        }
        await existingCart.save();
        return true;
    }

    async getProductByCartId(id) {
        const existingCart = await cartModel.findOne({ _id: id }).populate('products.product');
        return existingCart ? existingCart.products : { error: 'cart_not_found' };
    }

    async updateCartProducts(cid, products) {
        const existingCart = await cartModel.findOne({ _id: cid });
        if (!existingCart) {
            return { error: 'cart_not_found' };
        }
        existingCart.products = products;
        await existingCart.save();
        return true;
    }

    async updateProductQuantity(cid, pid, quantity) {
        const existingCart = await cartModel.findOne({ _id: cid });
        if (!existingCart) {
            return { error: 'cart_not_found' };
        }
        const productIndex = existingCart.products.findIndex(p => String(p.product) === String(pid));
        if (productIndex === -1) {
            return { error: 'product_not_found' };
        }
        existingCart.products[productIndex].quantity = quantity;
        await existingCart.save();
        return true;
    }

    async deleteProductFromCart(cid, pid) {
        const existingCart = await cartModel.findOne({ _id: cid });
        if (!existingCart) {
            return { error: 'cart_not_found' };
        }
        const productIndex = existingCart.products.findIndex(p => String(p.product) === String(pid));
        if (productIndex === -1) {
            return { error: 'product_not_found' };
        }
        existingCart.products.splice(productIndex, 1);
        await existingCart.save();
        return true;
    }

    async clearCart(cid) {
        const existingCart = await cartModel.findOne({ _id: cid });
        if (!existingCart) {
            return { error: 'cart_not_found' };
        }
        existingCart.products = [];
        await existingCart.save();
        return true;
    }
}

export default CartManager;