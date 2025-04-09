import mongoose from "mongoose"

const CartItemSchema = new mongoose.Schema(
    {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
    },
    { _id: false } // Убираем поле _id для каждого элемента массива
)

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        cartItems: [CartItemSchema],
        favoriteItems: [],
    },
    { timestamps: true }
)

export default mongoose.model('User', UserSchema)
