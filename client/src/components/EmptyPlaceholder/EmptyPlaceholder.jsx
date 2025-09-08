import styles from './EmptyPlaceholder.module.css'

export default function EmptyPlaceholder({ title, action, actionTitle }) {
    return (
        <section className={styles['empty-placeholder']}>
            <p className={styles['title']}>{title}</p>
            {Boolean(action) && <button onClick={action} type='button'>{actionTitle}</button>}
        </section>
    )
}
