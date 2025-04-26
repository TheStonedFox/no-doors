import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { CheckAuth } from './middleware/CheckAuth.js'
import cors from 'cors'

//#region controllers
import * as authController from './controllers/authController.js'
import * as userController from './controllers/userController.js'
import * as productController from './controllers/productController.js'
import * as favoriteController from './controllers/favoriteController.js'
import * as cartController from './controllers/cartController.js'
import * as paymentController from './controllers/paymentController.js'
import * as orderController from './controllers/orderController.js'

//#endregion

import * as validations from './validations.js'


dotenv.config()

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qamea.mongodb.net/no-doors?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log('DB ok'))
    .catch(() => console.log('DB err'))

const app = express()

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
//#endregion

//#region products
app.get('/products', productController.getProducts)

app.get('/products/:id', productController.getProduct)

app.post('/products', productController.addProduct)
//#endregion

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
app.post('/auth/check', CheckAuth, (req, res) => res.json({ msg: 'token valid' }))
//#endregion


//#endregion

app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log(`The server is running on port ${process.env.PORT || 5000}`);
})


