
import styles from './LanguageDropdown.module.css'

export default function LanguageDropdown({ className }) {
    return (
        <div className={className}>
            <div className={styles['language-switch']}>
                <p className={styles['language-switch__title']}>Русский</p>
                <svg className={styles['language-switch__arrow-btn']} width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.05666 1.52834L4 4.585L0.943344 1.52834L0 2.47166L4 6.47166L8 2.47166L7.05666 1.52834Z" fill="#181818" />
                </svg>
            </div>
        </div>
    )
}
