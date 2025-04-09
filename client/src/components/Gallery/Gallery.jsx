import React from 'react'

import styles from './Gallery.module.css'

export default function Gallery() {
    return (
        <div className={styles.gallery}>
            <div className={styles.gallery__item}> <img src=".././../../public/images/gallery/01.jpg" alt="gallery image" /> </div>
            <iframe className={styles.gallery__item} width="100%" height="100%" src="https://www.youtube.com/embed/a3ICNMQW7Ok?si=o8jVcNskvraOrB_q" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <div className={styles.gallery__item}> <img src=".././../../public/images/gallery/03.jpg" alt="gallery image" /> </div>
            <div className={styles.gallery__item}> <img src=".././../../public/images/gallery/07.jpg" alt="gallery image" /> </div>
            <div className={styles.gallery__item}> <img src=".././../../public/images/gallery/05.jpg" alt="gallery image" /> </div>
            <div className={styles.gallery__item}> <img src=".././../../public/images/gallery/06.jpg" alt="gallery image" /> </div>
        </div>
    )
}
