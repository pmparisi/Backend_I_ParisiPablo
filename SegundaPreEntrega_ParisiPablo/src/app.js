import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import __dirname from './utils/utils.js';
import ProductManager from './managers/productManager.js';

console.log('__dirname:', __dirname);

const app = express();

const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>console.log(`Listening on PORT: ${PORT}`));
const io = new Server(server);
const productManager = new ProductManager();


io.on('connection', (socketClient) => {
    console.log('Client connected');

    socketClient.on('getProducts', async () => {
        const products = await productManager.getProducts();
        io.emit('response', products);
    });

    socketClient.on('addProduct', async (product) => {
        const newProduct = await productManager.addProduct(product);
        if (newProduct) {
            const products = await productManager.getProducts();
            io.emit('response', products);
        }
    });

    socketClient.on('deleteProduct', async (productId) => {
        const deletedProduct = await productManager.deleteProduct(parseInt(productId));
        if (deletedProduct) {
            const products = await productManager.getProducts();
            io.emit('response', products); 
        }
    });
});

app.engine('handlebars',handlebars.engine());
app.set('views',`${__dirname}/../views`);
app.set('view engine','handlebars');

app.use(express.static(`${__dirname}/../public`));
app.use(express.json());

app.use('/',viewsRouter);
app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);

app.use((req, res, next) => {
    res.status(404).render('404', { title: '404 Not Found',css: '404' });
});

