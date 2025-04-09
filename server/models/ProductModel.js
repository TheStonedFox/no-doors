import mongoose from 'mongoose'

const ProductModel = new mongoose.Schema({
    title: String,
    price: Number,
    wholesalePrice: Number,
    inStock: Number,
    discount: Number,
    views: [],
}, { timestamps: true })

export default mongoose.model('Product', ProductModel)