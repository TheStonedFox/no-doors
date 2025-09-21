import styles from './StarCount.module.css'
export default function StarCount({ data }) {



    const totalStars = Object.entries(data || {}).reduce((acc, value) => acc + value[1], 0)
    return totalStars ? (
        <section className={styles['star-count-list']}>
            {Object.entries(data || {}).map(i => {
                return i[1] ? (<section key={i[0]} className={styles['count-item']}>
                    <p style={{ textWrap: 'nowrap' }}>{i[0]} ★</p>
                    <div className={styles['count-item__percent']} style={{ width: `${i[1] / totalStars * 100}%` }}></div>
                    <p className={styles['count-item_value']}>{i[1] || 0}</p>
                </section>) : null
            })}
        </section>
    ) : null
}
