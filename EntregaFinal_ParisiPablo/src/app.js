import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import __dirname from './utils/utils.js';
import ProductManager from './managers/mongo/productManager.js';

console.log('__dirname:', __dirname);

const app = express();

const PORT = process.env.PORT||8080;
const CONECCTION_STRING = "mongodb+srv://parisipm:Pablo1793@cluster0.cpqmesw.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

const connection = mongoose.connect(CONECCTION_STRING);
const server = app.listen(PORT,()=>console.log(`Listening on PORT: ${PORT}`));
const io = new Server(server);
const productManager = new ProductManager();


io.on('connection', (socketClient) => {
    console.log('Client connected');

    socketClient.on('getProducts', async () => {
        const products = await productManager.getAllProducts();
        io.emit('response', products);
    });

    socketClient.on('addProduct', async (product) => {
        const newProduct = await productManager.addProduct(product);
        if (newProduct) {
            const products = await productManager.getAllProducts();
            io.emit('response', products);
        }
    });

    socketClient.on('deleteProduct', async (productId) => {
        const deletedProduct = await productManager.deleteProduct(productId);
        if (deletedProduct) {
            const products = await productManager.getAllProducts();
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

