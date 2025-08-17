import styles from './BorderedButton.module.css'

export default function BorderedButton({ title, onClick, className }) {
    return (
        <button
            className={`${styles.button} ${className ? className : null}`}
            onClick={onClick}
        >{title || 'Bordered Button'}</button>
    )
}
