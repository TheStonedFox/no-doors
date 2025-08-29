import { useEffect, useRef } from 'react'
import Comment from '../../components/Comment/Comment'
import styles from './CommentPage.module.css'
import { useState } from 'react'
import { getAllReplies, getComment } from '../../api/api'
import { useNavigate, useParams } from 'react-router-dom'
import { IoChevronBackOutline } from "react-icons/io5"
import { useSelector } from 'react-redux'
import SkeletonLadingShimmer from '../../components/SkeletonLadingShimmer/SkeletonLadingShimmer'
export default function CommentPage() {
    const navigate = useNavigate()
    const [replies, setReplies] = useState([])
    const [comment, setComment] = useState()
    const { commentId } = useParams()

    const idCommentToUpdate = useSelector(state => state.shared.idCommentToUpdate)

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        getAllReplies(commentId).then(res => setReplies(res.replies)).catch(error => console.log(error)).finally(() => setIsLoading(false))
        getComment(commentId).then(res => setComment(res.comment)).catch(error => console.log(error)).finally(() => setIsLoading(false))
    }, [idCommentToUpdate, commentId])

    const backButtonRef = useRef(null)
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



    return (
        <section className={`${styles['comment-page']} container`}>
            {/* <h2 className={`${'section-title'} ${styles['comment-page__title']}`}>Отзыв к товару</h2> */}
            <button className={styles['comment-page__back-button']}
                ref={backButtonRef}
                type='button'
                onClick={() => navigate(`/products/${comment?.productId}/comments`)}>
                <IoChevronBackOutline />
                <p>Вернутся к остальным отзывам товара</p>
            </button>
            {comment && < Comment commentData={comment} />}
            <section className={styles['comment-page__replies']}>
                {!isLoading ? <h3 className={styles['replies-title']}>Ответы</h3> : <SkeletonLadingShimmer style={{ height: '40px', width: '100%' }} />}
                {replies && replies?.map(reply => <Comment commentData={reply} type='reply' key={reply._id} />)}
            </section>
        </section>
    )
}
