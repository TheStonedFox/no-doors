import styles from './ReplyPopup.module.css'

import Button from '../../../Button/Button'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addNotification } from '../../../../redux/features/uiSlice'
import { getReply, editReply, addReply } from '../../../../api/api.js'

import { setIdCommentToUpdate } from '../../../../redux/features/sharedSlice.js'
import { togglePopup } from '../../../../redux/features/uiSlice.js'

export default function ReplyPopup({ ...data }) {
    const dispatch = useDispatch()
    const [replyData, setReplyData] = useState({ text: null })

    const { replyId, userId, commentId, type } = data || {}

    useEffect(() => {
        if (type === 'edit-reply')
            getReply(replyId).then(res => setReplyData(res.reply)).catch(error => console.log(error))
    }, [])

    const onSuccessSubmit = (text) => {
        dispatch(addNotification({ type: 'success', text: text }))
        dispatch(setIdCommentToUpdate(commentId))
        dispatch(togglePopup())
    }

    const onSubmitReplyButtonClick = () => {
        if (!replyData.text) return dispatch(addNotification({ type: 'error', text: 'Поле с тексом обязательно для заполнения.' }))


        type === 'reply' && addReply({ text: replyData.text, commentId, userId })
            .then(res => onSuccessSubmit(res.message))
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))

        type === 'edit-reply' && editReply(replyId, replyData)
            .then(res => onSuccessSubmit(res.message))
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))
    }

    return (
        <div className={styles['reply-popup']}>
            {type === 'edit-reply' ? <h3>Изменить ответ</h3> : <h3>Написать ответ</h3>}
            <textarea
                placeholder='Ответ...'
                className={styles['reply-popup__text']}
                value={replyData?.text}
                onChange={(value) => setReplyData(prev => ({ ...prev, text: value.target.value }))}
            ></textarea>

            <Button
                className={styles['submit-reply-button']}
                title={`${type === 'edit-reply' ? 'Обновить отзыв' : 'Отправить отзыв'}`}
                onClick={onSubmitReplyButtonClick} />
        </div>
    )
}
