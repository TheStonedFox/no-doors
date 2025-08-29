import mongoose from 'mongoose'

const starsValuesSchema = new mongoose.Schema({
    1: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    5: { type: Number, default: 0 },
}, { _id: false })

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
    ratingValue: { type: Number, default: 0 },
    starsValues: { type: starsValuesSchema, default: {} }
}, { timestamps: true })

export default mongoose.model('Product', ProductModel)