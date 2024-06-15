import { Router } from 'express';
import CartManager from '../managers/cartManager.js'
import ProductManager from '../managers/productManager.js';

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

router.post('/',async (req,res)=>{
    const cartId = await cartManager.addCart();
    if (cartId === -1) return res.status(500).send({status:"error",error:"An error occurred while adding the cart. Please try again later."});
    return res.send({status:"success",message:`Cart created with id: ${cartId}`});
})

router.get('/:cid',async (req,res)=>{    
    let id = req.params.cid;
    if (isNaN(id)) return res.status(400).send({status:"error",error:"The id is not a number. Please try again."});
    id = parseInt(id);
    const products  = await cartManager.getProductByCartId(id);
    if (products === -1) return res.status(500).send({status:"error",error:"An error occurred while getting the product. Please try again later."});
    if (products.error === 'cart_not_found') return res.status(400).send({status:"error",error:`The cart with id ${id} does not exist. Please try again.`});
    return res.send({status:"success",payload:products});
})

router.post('/:cid/product/:pid',async (req,res)=>{
    let cid = req.params.cid;
    let pid = req.params.pid;
    if (isNaN(cid)) return res.status(400).send({status:"error",error:"The cart id is not a number. Please try again."});
    if (isNaN(pid)) return res.status(400).send({status:"error",error:"The product id is not a number. Please try again."});
    cid = parseInt(cid);
    pid = parseInt(pid);
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

export default router;