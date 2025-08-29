import styles from './ReviewStars.module.css'

export default function ReviewStars({ ratingValue }) {
    return (
        <section className={styles['review-stars']}>
            <div className={styles['review-stars__unfilled']}>★★★★★</div>
            <div className={styles['review-stars__filled']} style={{ width: `${ratingValue * 100 / 5}%` }}>★★★★★</div>
        </section>
    )
}
