import styles from './EmptyPlaceholder.module.css'

export default function EmptyPlaceholder({ title }) {
    return (
        <p className={styles['title']}>{title}</p>
    )
}
