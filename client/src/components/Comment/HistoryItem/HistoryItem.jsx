
import ReviewStars from '../../ReviewStars/ReviewStars'
import styles from './HistoryItem.module.css'
export default function HistoryItem({ data }) {
    const date = new Date(data.createdAt)
    return (
        <section key={data._id} className={styles['history-item']}>
            <section className={styles['history-item__header']}>
                <p className={styles['history-item__date']}>{date.toLocaleDateString()}</p>
                <ReviewStars ratingValue={data.ratingValue} />
            </section>
            <p className={styles['history-item__text']}>{data.text}</p>
        </section>
    )
}
