import mongoose, { Schema } from "mongoose"

const UserData = new Schema({
    fio: String,
    phone: String,
    email: String,
}, { _id: false })

const OrderModel = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    products: {
        required: true,
        type: Array
    },
    sum: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'new', 'accepted', 'delivered', 'rejected', 'completed', 'paid'],
        default: function () {
            return this.paymentMethod === 'offline' ? 'new' : 'pending';
        }
    },
    deliveryMethod: {
        type: String,
        enum: ['delivery', 'pickup'],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['online', 'offline'],
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    userData: {
        type: UserData,
        required: true
    }
}, { timestamps: true })

export default mongoose.model('Order', OrderModel)