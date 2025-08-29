import mongoose, { Schema } from "mongoose"

const CommentReplySchema = new mongoose.Schema({
    commentId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    text: {
        type: String,
        required: true
    },
    likes: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    dislikes: {
        type: [Schema.Types.ObjectId],
        default: []
    },
}, { timestamps: true })

export default mongoose.model('CommentsReplies', CommentReplySchema)