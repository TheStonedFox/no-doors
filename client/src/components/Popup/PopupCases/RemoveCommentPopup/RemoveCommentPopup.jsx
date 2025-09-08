import { useDispatch } from "react-redux"
import { addNotification, togglePopup } from "../../../../redux/features/uiSlice"
import BorderedButton from "../../../BorderedButton/BorderedButton"
import Button from "../../../Button/Button"
import styles from './RemoveCommentPopup.module.css'
import { removeComment } from "../../../../api/api"
import { setIdCommentToUpdate } from "../../../../redux/features/sharedSlice"



export default function RemoveCommentPopup({ commentType, commentId }) {
    const dispatch = useDispatch()

    const onRemoveButtonClick = () => {
        removeComment(commentId, commentType)
            .then(res => {
                dispatch(addNotification({ type: 'success', text: res.message }))
                dispatch(setIdCommentToUpdate(commentId))
                dispatch(togglePopup())
            })
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))
    }

    return (
        <section className={styles['remove-comment-popup']}>
            <h2>{` Удалить ${commentType === 'reply' ? 'ответ' : 'вопрос'} ?`}</h2>
            <div className={styles['buttons']}>
                <Button title='Удалить' onClick={onRemoveButtonClick} />
                <BorderedButton title='Нет' onClick={() => dispatch(togglePopup())} />
            </div>
        </section>
    )
}
