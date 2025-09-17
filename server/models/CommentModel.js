import mongoose, { Schema, Types } from "mongoose"

const editHistorySchema = new mongoose.Schema({
    ratingValue: { type: Number, default: 0 },
    text: { type: String, default: '' }
}, { timestamps: true, _id: false })

const CommentSchema = new mongoose.Schema({
    productId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        enum: ['review', 'question']
    },
    text: {
        type: String,
        required: true
    },
    editHistory: { type: [editHistorySchema], default: [] },
    reviewsCount: { type: Number },
    ratingValue: { type: Number },
    likes: { type: [Types.ObjectId], default: [] },
    dislikes: { type: [Types.ObjectId], default: [] },
    replies: { type: [String], default: [] }
}, { timestamps: true })

export default mongoose.model('Comments', CommentSchema)
