import mongoose from 'mongoose'

const ProductModel = new mongoose.Schema({
    title: String,
    brand: {
        type: String,
        enum: ['Apple', 'Samsung', 'Huawei', 'Xiaomi']
    },
    model: String,
    price: Number,
    category: {
        type: String,
        enum: ['Дисплеи', 'Аккумуляторы', 'Шлейфы', 'Камеры', 'Динамики', 'Чехлы', 'Защитные стекла', 'Разное']
    },
    wholesalePrice: Number,
    inStock: Number,
    discount: Number,
    views: [],
}, { timestamps: true })

export default mongoose.model('Product', ProductModel)