import { Router } from 'express';
import ProductManager from '../managers/mongo/productManager.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const { page, limit } = req.query;
    if (!page) {
        const pageEnd = 1;
        
        console.log(pageEnd)
    }
    console.log(limit)

    const productsResult = await productManager.getProducts({ limit, page });
    if (!productsResult) return res.status(500).send({ status: "error", error: "An error occurred while getting the products. Please try again later." });
    const { docs: products, totalPages, page: currentPage, hasNextPage, hasPrevPage, nextPage, prevPage } = productsResult;

    res.render('home', { 
        title: 'Home', 
        css: 'home', 
        products,
        totalPages,
        currentPage,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        limit
    });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render('realTimeProducts', { title: 'Real Time Products', css: 'realTimeProducts', products });
});

export default router;
