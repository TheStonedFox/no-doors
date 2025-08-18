import express, { query } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
//#region controllers
import * as authController from './controllers/authController.js'
import * as userController from './controllers/userController.js'
import * as productController from './controllers/productController.js'
import * as favoriteController from './controllers/favoriteController.js'
import * as cartController from './controllers/cartController.js'
import * as paymentController from './controllers/paymentController.js'
import * as orderController from './controllers/orderController.js'
import * as sharedController from './controllers/sharedController.js'

import { CheckAuth } from './middleware/CheckAuth.js'
import { CheckCaptcha } from './middleware/CheckCaptcha.js'
import { CheckValidation } from './middleware/CheckValidation.js'

//#endregion

import * as validations from './validations.js'
import ProductModel from './models/ProductModel.js'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qamea.mongodb.net/no-doors?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log('DB ok'))
    .catch(() => console.log('DB err'))

const app = express()

const storage = multer.memoryStorage()
const upload = multer({ storage })


app.use(cors())
app.use(express.json())

//#region Routes

//#region auth
app.post('/auth/register', validations.registerValidation, authController.register)
app.post('/auth/login', authController.login)
//#endregion


//#region  user
app.get('/profile', CheckAuth, userController.profile)
app.patch('/profile', CheckAuth, validations.profileInfoValidation, userController.update)
app.post('/profile/upload', CheckAuth, upload.single("avatar"), userController.uploadAvatar)
//#endregion

//#region products
app.get('/products', productController.getProducts)

app.get('/products/:id', productController.getProduct)

app.post('/products', productController.addProduct)
//#endregion

app.get('/search', async (req, res) => {

    const filters = {
        brand: req.query.brand || '',
        model: req.query.model || '',
        category: req.query.category || '',
        word: req.query.word || '',
        minPrice: Number(req.query.minPrice) || 0,
        maxPrice: Number(req.query.maxPrice) || 10000
    }

    const query = {}

    if (filters.category) query.category = filters.category
    if (filters.brand) query.brand = filters.brand
    if (filters.model) query.model = filters.model


    const list = await ProductModel.find(query)
    if (!list.length)
        return res.status(404).json({ message: 'Не найдено ни одного товара.', filters, code: 404 })

    const finalList =
        list.filter(item => {
            if (filters.word)
                return item.price > filters.minPrice && item.price <= filters.maxPrice && item.title.includes(filters.word)

            return item.price > filters.minPrice && item.price <= filters.maxPrice
        }).sort((a, b) => {
            const aFinal = a.price - (a.discount ? (a.price * a.discount) / 100 : 0)
            const bFinal = b.price - (b.discount ? (b.price * b.discount) / 100 : 0)
            if (req.query.sortType === 'increasingPrice') return aFinal - bFinal
            if (req.query.sortType === 'decreasingPrice') return bFinal - aFinal
            if (req.query.sortType === 'increasingBrand') return a.brand.localeCompare(b.brand)
            if (req.query.sortType === 'decreasingBrand') return b.brand.localeCompare(a.brand)
            if (req.query.sortType === 'increasingDiscount') return a.discount - b.discount
            if (req.query.sortType === 'decreasingDiscount') return b.discount - a.discount

            // if (req.query.sortType === 'increasingDate') a.createdAt
            // if (req.query.sortType === 'decreasingDate') b.brand.localeCompare(a.brand)
        })

    if (!finalList.length)
        return res.status(404).json({ message: 'Не найдено ни одного товара.1', filters, code: 404 })

    res.status(200).json({ filters, products: finalList, message: 'Товары найдены.', code: 200 })
})

//#region favorites
app.post('/favorites/:productId', CheckAuth, favoriteController.addFavoriteItem)
app.delete('/favorites/:productId', CheckAuth, favoriteController.removeFavoriteItem)
//#endregion

//#region cart
app.post('/cart-items/:productId', cartController.addCartItem)
app.delete('/cart-items/:productId', cartController.removeCartItem)
app.patch('/cart-items/:id', cartController.updateCartItem)
//#endregion

//#region orders
app.post('/orders', CheckAuth, validations.orderValidation, orderController.createOrder)
app.get('/orders/:id', CheckAuth, orderController.getOrder)
app.patch('/orders/:id', CheckAuth, orderController.updateOrderStatus)
//#endregion

//#region liqpay
app.post('/create-payment', CheckAuth, paymentController.create)
app.post('/payment-status/:orderId', CheckAuth, paymentController.status)
//#endregion

//#region service
app.post('/auth/check', CheckAuth, (req, res) => res.status(200).json({ message: 'token valid', code: 200 }))
//#endregion

//#endregion

app.get('/chooses-steps', sharedController.getChooseSteps)

app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log(`The server is running on port ${process.env.PORT || 5000}`)
})


