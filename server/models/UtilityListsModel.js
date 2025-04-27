import mongoose from 'mongoose'


const ModelModel = new mongoose.Schema({
    title: String,
    imageUrl: String,
    deviceType: ['Смартфоны', 'Планшеты', 'Часы']
}, { _id: false, timestamps: false })

const BrandModel = new mongoose.Schema({
    title: String,
    models: [ModelModel]
}, { _id: false, timestamps: false })


const UtilityListsModel = new mongoose.Schema({
    brands: [BrandModel],
    categories: [],
})

export default mongoose.model('UtilityListsModel', UtilityListsModel)