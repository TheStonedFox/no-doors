import mongoose from 'mongoose'

const CartItemSchema = new mongoose.Schema(
    {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
    },
    { _id: false } // Убираем поле _id для каждого элемента массива
)

const UserSchema = new mongoose.Schema(
    {
        fio: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
        },
        city: String,
        postOffice: String,
        password: {
            type: String,
            required: true,
        },
        postOffice: String,
        viewedProducts: [],
        cartItems: [CartItemSchema],
        favoriteItems: [],
        orders: [],
    },
    { timestamps: true }
)

export default mongoose.model('User', UserSchema)
