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

const resetTokenModel = new mongoose.Schema({
    user: mongoose.Types.ObjectId,
    token: String,
    expires: Date
}, { _id: false })

const emailConfirmCodeModel = new mongoose.Schema({
    email: String,
    code: String,
    expires: Date
}, { _id: false })


const UtilityListsModel = new mongoose.Schema({
    brands: [BrandModel],
    categories: [],
    resetPasswordTokens: [resetTokenModel],
    emailConfirmedCodes: [emailConfirmCodeModel]
})

export default mongoose.model('UtilityListsModel', UtilityListsModel)