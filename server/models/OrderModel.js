import mongoose, { Schema } from "mongoose"

const UserData = new Schema({
    fio: String,
    phone: String,
    email: String,
})

const OrderModel = new Schema({
    products: {
        required: true,
        type: Array
    },
    deliveryType: {
        type: String,
        enum: ['delivery', 'pickup'],
        required: true
    },
    userData: {
        type: UserData,
        required: true
    }
}, { timestamps: true })

export default mongoose.model('Order', OrderModel)