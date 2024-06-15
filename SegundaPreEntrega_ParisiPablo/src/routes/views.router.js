import { Router } from 'express';
import ProductManager from '../managers/productManager.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
        const products = await productManager.getProducts();
        res.render('home', { title: 'Home',css: 'home', products });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { title: 'Real Time Products', css: 'realTimeProducts', products });
});

export default router;