import styles from './BorderedButton.module.css'

export default function BorderedButton({ title, onClick, className, disabled }) {
    return (
        <button
            disabled={disabled}
            className={`${styles.button} ${className ? className : null}`}
            onClick={onClick}
        >{title || 'Bordered Button'}</button>
    )
}
