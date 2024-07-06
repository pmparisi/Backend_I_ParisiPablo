import { Router } from 'express';
import CartManager from '../managers/mongo/cartManager.js'
import ProductManager from '../managers/mongo/productManager.js';

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();


router.get('/:cid',async (req,res)=>{    
    let id = req.params.cid;
    const products  = await cartManager.getProductByCartId(id);
    if (products === -1) return res.status(500).send({status:"error",error:"An error occurred while getting the product. Please try again later."});
    if (products.error === 'cart_not_found') return res.status(400).send({status:"error",error:`The cart with id ${id} does not exist. Please try again.`});
    return res.send({status:"success",payload:products});
})

router.post('/',async (req,res)=>{
    const cartId = await cartManager.addCart();
    if (cartId === -1) return res.status(500).send({status:"error",error:"An error occurred while adding the cart. Please try again later."});
    return res.send({status:"success",message:`Cart created with id: ${cartId}`});
})

router.post('/:cid/product/:pid',async (req,res)=>{
    let cid = req.params.cid;
    let pid = req.params.pid;
    const productById = await productManager.getProductById(pid);
    if (productById === -1) return res.status(500).send({status:"error",error:"An error occurred while getting the product. Please try again later."});
    if (productById.error === 'product_not_found') return res.status(400).send({status:"error",error:`The product with id ${pid} does not exist. Please try again.`});
    let quantity = req.body.quantity ? parseInt(req.body.quantity) : 1 ;
    if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).send({ status:"error",error:"The quantity must be a positive number. Please try again." });
    }
    const result = await cartManager.addProductToCart(cid, pid, quantity);
    if (result === -1) return res.status(500).send({status:"error",error:"An error occurred while adding the product to the cart. Please try again later."});
    if (result.error === 'cart_not_found') return res.status(400).send({status:"error",error:`The cart with id ${cid} does not exist. Please try again.`});
    return res.send({status:"success",message:`Product with id ${pid} added to cart with id ${cid}`});
})

router.put('/:cid', async (req, res) => {
    let cid = req.params.cid;
    let products = req.body.products;
    const result = await cartManager.updateCartProducts(cid, products);
    if (result.error === 'cart_not_found') return res.status(400).send({status: "error", error: `The cart with id ${cid} does not exist. Please try again.`});
    return res.send({status: "success", message: `Cart with id ${cid} updated successfully`});
})

router.put('/:cid/products/:pid', async (req, res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    let quantity = req.body.quantity;
    if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).send({status: "error", error: "The quantity must be a positive number. Please try again."});
    }
    const result = await cartManager.updateProductQuantity(cid, pid, quantity);
    if (result.error === 'cart_not_found') return res.status(400).send({status: "error", error: `The cart with id ${cid} does not exist. Please try again.`});
    if (result.error === 'product_not_found') return res.status(400).send({status: "error", error: `The product with id ${pid} does not exist in the cart.`});
    return res.send({status: "success", message: `Product quantity updated for product with id ${pid} in cart with id ${cid}`});
})

router.delete('/:cid', async (req, res) => {
    let cid = req.params.cid;
    const result = await cartManager.clearCart(cid);
    if (result.error === 'cart_not_found') return res.status(400).send({status: "error", error: `The cart with id ${cid} does not exist. Please try again.`});
    return res.send({status: "success", message: `All products removed from cart with id ${cid}`});
})

router.delete('/:cid/products/:pid', async (req, res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    const result = await cartManager.deleteProductFromCart(cid, pid);
    if (result.error === 'cart_not_found') return res.status(400).send({status: "error", error: `The cart with id ${cid} does not exist. Please try again.`});
    if (result.error === 'product_not_found') return res.status(400).send({status: "error", error: `The product with id ${pid} does not exist in the cart.`});
    return res.send({status: "success", message: `Product with id ${pid} removed from cart with id ${cid}`});
})

export default router;