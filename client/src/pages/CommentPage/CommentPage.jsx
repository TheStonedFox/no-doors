import { useEffect, useRef } from 'react'
import Comment from '../../components/Comment/Comment'
import styles from './CommentPage.module.css'
import { useState } from 'react'
import { getAllReplies, getComment } from '../../api/api'
import { useNavigate, useParams } from 'react-router-dom'
import { IoChevronBackOutline } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import SkeletonLadingShimmer from '../../components/SkeletonLadingShimmer/SkeletonLadingShimmer'

import EmptyPlaceholder from '../../components/EmptyPlaceholder/EmptyPlaceholder'
import { setIdCommentToUpdate } from '../../redux/features/sharedSlice'
import Button from '../../components/Button/Button'
import { addNotification, togglePopup } from '../../redux/features/uiSlice'

export default function CommentPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const idCommentToUpdate = useSelector(state => state.shared.idCommentToUpdate)
    const isLogged = useSelector(state => state.user.isTokenValid)

    const userData = useSelector(state => state.user.userData)

    const [replies, setReplies] = useState([])
    const [comment, setComment] = useState()
    const { commentId } = useParams()
    const [isLoading, setIsLoading] = useState(true)

    const { userId, type, productId } = comment || {}

    const backButtonRef = useRef(null)

    useEffect(() => {
        setIsLoading(true)
        if (!commentId) return
        getComment(commentId).then(res => {
            setComment(res.comment)
            getAllReplies(commentId).then(res => setReplies(res.replies)).catch(error => console.log(error))
            // dispatch(setIdCommentToUpdate(null))
        }).catch(error => console.log(error)).finally(() => setIsLoading(false))


    }, [idCommentToUpdate, commentId])

    useEffect(() => {
        const handleEscDown = (e) => e.key === 'Escape' && backButtonRef.current.setAttribute('style', 'background-color:var(--ui---main);')
        const handleEscUp = (e) => e.key === 'Escape' && backButtonRef.current.click()
        document.addEventListener('keyup', handleEscUp)
        document.addEventListener('keydown', handleEscDown)

        return () => {
            document.removeEventListener('keyup', handleEscUp)
            document.removeEventListener('keydown', handleEscDown)
        }
    }, [])


    const onReplyButtonClick = (e) => {
        if (!isLogged)
            return dispatch(addNotification({ type: 'info', text: 'Чтобы совершить это действие, нужно войти в аккаунт.', route: 'auth' }))
        dispatch(togglePopup({ type: 'reply', data: { commentId, userId: userData?._id } }))
    }

    return (
        <section className={`${styles['comment-page']} container`}>
            {/* <h2 className={`${'section-title'} ${styles['comment-page__title']}`}>Отзыв к товару</h2> */}
            <button className={styles['comment-page__back-button']}
                ref={backButtonRef}
                type='button'
                onClick={() => navigate(`/products/${productId}/comments?type=${type}`)}>
                <IoChevronBackOutline />
                <p>{`Вернутся к остальным ${type === 'review' ? 'отзывам' : 'вопросам'}`}</p>
            </button>
            {comment && < Comment commentData={comment} />}
            <section className={styles['comment-page__replies']}>
                {!isLoading && <h3 className={styles['replies-title']}>Ответы</h3>}

                {replies && replies?.map(reply => <Comment commentData={reply} type='reply' key={reply._id} />)}

                {!replies.length && !isLoading && <EmptyPlaceholder title='Ответов нет.' action={userId !== userData?._id && isLogged && onReplyButtonClick} actionTitle='Будьте первым, кто оставит ответит. 😉' />}
            </section>
        </section>
    )
}
