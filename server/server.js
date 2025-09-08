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
import * as commentsController from './controllers/commentsController.js'
import * as replyController from './controllers/replyController.js'
import * as validations from './validations.js'
//#endregion

import { CheckAuth } from './middleware/CheckAuth.js'


//#region config
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
//#endregion


//#region Routes

//#region auth
app.post('/auth/register', validations.registerValidation, authController.register)
app.post('/auth/login', authController.login)

app.post('/auth/remove-codes', authController.removeCodes)
app.post('/auth/reset-password', validations.registerValidation, authController.resetPassword)
app.get('/auth/reset-password', authController.checkLink)
app.patch('/auth/reset-password', validations.registerValidation, authController.updatePassword)
// app.get('/auth/reset-password', (req, res) => res.json({ token: req.query.token }))
//#endregion

//#region  user
app.get('/profile', CheckAuth, userController.profile)
app.get('/profile/:userId', userController.getUserInfo)
app.patch('/profile', CheckAuth, validations.profileInfoValidation, userController.update)
app.post('/profile/upload', CheckAuth, upload.single("avatar"), userController.uploadAvatar)
//#endregion

//#region products
app.get('/products/review-eligibility', productController.checkReviewEligibility)
app.get('/products', productController.getProducts)
app.post('/products', productController.addProduct)
app.get('/products/:id', productController.getProduct)
app.get('/products/:id/comments', productController.getAllComments)
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

//#region comments
app.post('/comments/', CheckAuth, commentsController.addComment)
app.get('/comments/:commentId', commentsController.getComment)
app.patch('/comments/:commentId', CheckAuth, commentsController.editComment)
app.patch('/comments/:commentId/like', CheckAuth, commentsController.likeComment)
app.delete('/comments/:commentId', CheckAuth, commentsController.removeComment)
app.get('/comments/:commentId/replies/', commentsController.getAllReplies)

app.get('/replies/:replyId', replyController.getReply)
app.post('/replies', CheckAuth, replyController.addReply)
app.patch('/replies/:replyId/like', CheckAuth, replyController.replyLike)
app.patch('/replies/:replyId', CheckAuth, replyController.editReply)
//#endregion


//#region liqpay
app.post('/create-payment', CheckAuth, paymentController.create)
app.post('/payment-status/:orderId', CheckAuth, paymentController.status)
//#endregion

//#region service
app.post('/auth/check', CheckAuth, (req, res) => res.status(200).json({ message: 'token valid', code: 200 }))
app.get('/chooses-steps', sharedController.getChooseSteps)
//#endregion

app.get('/search', productController.searchProducts)
//#endregion



app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log(`The server is running on port ${process.env.PORT || 5000}`)
})


