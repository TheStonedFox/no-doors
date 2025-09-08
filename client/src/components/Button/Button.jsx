import styles from './Button.module.css'

export default function Button({ className, onClick, title, type, disabled }) {
    return (
        <button disabled={disabled} className={`${styles.button} ${className || ''}`} type={type} onClick={onClick}>
            <p>{title}</p>
        </button >
    )
}
