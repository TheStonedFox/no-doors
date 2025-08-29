export const setLikes = async (req, res, collection) => {
    try {
        const replyId = req.params.replyId || req.params.commentId

        const { method, userId } = req.body

        const reply = await collection.findById(replyId)

        if (!reply)
            return res.status(404).json({ message: 'Не найден' })

        if (method === 'like') {
            if (reply.dislikes.includes(userId))
                await collection.findOneAndUpdate({ _id: replyId }, { $pull: { dislikes: userId } })

            if (!reply.likes.includes(userId)) {
                await collection.findOneAndUpdate({ _id: replyId }, { $push: { likes: userId } })
                return res.status(200).json({ message: 'Лайк поставлен' })
            }

            if (reply.likes.includes(userId)) {
                await collection.findOneAndUpdate({ _id: replyId }, { $pull: { likes: userId } },)
                return res.status(200).json({ message: 'Лайк убран' })
            }
        }

        if (method === 'dislike') {
            if (reply.likes.includes(userId))
                await collection.findOneAndUpdate({ _id: replyId }, { $pull: { likes: userId } })

            if (!reply.dislikes.includes(userId)) {
                await collection.findOneAndUpdate({ _id: replyId }, { $push: { dislikes: userId } })
                return res.status(200).json({ message: 'Дизлайк поставлен' })
            }

            if (reply.dislikes.includes(userId)) {
                await collection.findOneAndUpdate({ _id: replyId }, { $pull: { dislikes: userId } })
                return res.status(200).json({ message: 'Дизлайк убран' })
            }
        }

    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}