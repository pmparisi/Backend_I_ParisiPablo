import { Router } from 'express';
import ProductManager from '../managers/mongo/productManager.js'

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const { limit, page } = req.query;
    const products = await productManager.getProducts({ limit, page });
    if (!products) return res.status(500).send({ status: "error", error: "An error occurred while getting the products. Please try again later." });
    
    const { docs, totalPages, page: currentPage, prevPage, nextPage, hasPrevPage, hasNextPage } = products;
    
    return res.send({
        status: "success",
        payload: docs,
        totalPages,
        prevPage,
        nextPage,
        page: currentPage,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `/api/products?page=${prevPage}&limit=${limit}` : null,
        nextLink: hasNextPage ? `/api/products?page=${nextPage}&limit=${limit}` : null
    });
});

router.get('/:pid',async (req,res)=>{
    let id = req.params.pid;
    const product = await productManager.getProductById(id);
    if (product === -1) return res.status(500).send({status:"error",error:"An error occurred while getting the product. Please try again later."});
    if (product.error === 'product_not_found') return res.status(400).send({status:"error",error:`The product with id ${id} does not exist. Please try again.`});
    return res.send({status:"success",payload:product});
})

router.post('/',async (req,res)=>{
    const product = req.body;
    product.thumbnails = [];
    if (!product.status) {
        product.status = true; 
    }
    if (!product.title || !product.title.trim() || !product.description || !product.description.trim() || !product.code || !product.code.trim() || typeof product.price !== 'number' || product.price < 0 || typeof product.status !== 'boolean' || typeof product.stock !== 'number' || product.stock < 0 || !product.category || !product.category.trim()) {
        return res.status(400).send({status:'error',error:'Incomplete values. Please try again.'});
    }
    const productId = await productManager.addProduct(product);
    if (productId === -1) return res.status(500).send({status:"error",error:"An error occurred while adding the product. Please try again later."});
    return res.send({status:"success",message:`Product created with id: ${productId}`});
})

router.put('/:pid',async (req,res)=>{
    let id = req.params.pid;
    const product = await productManager.getProductById(id);
    if (product === -1) return res.status(500).send({status:"error",error:"An error occurred while getting the product. Please try again later."});
    if (product.error === 'product_not_found') return res.status(400).send({status:"error",error:`The product with id ${id} does not exist. Please try again.`});
    const updates = req.body;
    if ('id' in updates) return res.status(400).send({status:"error",error:"The product cannot be updated. Please remove the id field from the request and try again."});
    const productUpdated = await productManager.updateProduct(id,updates);
    if (productUpdated === -1) return res.status(500).send({status:"error",error:"An error occurred while updating the product. Please try again later."});
    if (productUpdated.error === 'product_not_found') {
        return res.status(400).send({status:"error",error:`The product does not exist. Please try again.`});
    }
    return res.send({status:"success",message:`Product with id: ${id} updated successfully`});
})

router.delete('/:pid', async (req,res)=>{
    let id = req.params.pid;
    const productDeleted = await productManager.deleteProduct(id);
    if (productDeleted === -1) return res.status(500).send({status:"error",error:"An error occurred while deleting the product. Please try again later."});
    if (productDeleted.error === 'product_not_found') {
        return res.status(400).send({status:"error",error:`The product does not exist. Please try again.`});
    }
    return res.send({status:"success",message:`Product with id: ${id} deleted successfully`});
})

export default router;