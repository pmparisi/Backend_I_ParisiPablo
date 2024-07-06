import mongoose from "mongoose";

const collection = "Carts";

const schema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Products',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
});

const cartModel = mongoose.model(collection,schema);

export default cartModel;