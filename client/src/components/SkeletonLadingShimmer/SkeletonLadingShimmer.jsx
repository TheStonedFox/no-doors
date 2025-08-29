
import styles from './SkeletonLadingShimmer.module.css'

export default function SkeletonLadingShimmer({ style }) {
    return (
        <div className={styles['skeleton-shimmer']} style={style}></div>
    )
}
