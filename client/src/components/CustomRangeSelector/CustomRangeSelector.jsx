import { useEffect, useRef, useState } from 'react'
import styles from './CustomRangeSelector.module.css'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const CustomRangeSelector = ({ min = 0, max = 10000, step = 5, initialMin, initialMax, onValuesChange }) => {
    const trackRef = useRef(null)
    const [trackWidth, setTrackWidth] = useState(1)

    const [range, setRange] = useState({
        minValue: initialMin ?? min,
        maxValue: initialMax ?? max
    })

    useEffect(() => {
        setRange({
            minValue: initialMin ?? min,
            maxValue: initialMax ?? max
        })
    }, [initialMin, initialMax, min, max])


    useEffect(() => {
        if (trackRef.current) {
            setTrackWidth(trackRef.current.offsetWidth)
        }
        const handleResize = () => {
            if (trackRef.current) setTrackWidth(trackRef.current.offsetWidth)
        }
        onValuesChange((range))
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const valueToPosition = (value) =>
        ((value - min) / (max - min)) * trackWidth

    const positionToValue = (pos) => {
        const raw = (pos / trackWidth) * (max - min) + min
        return Math.round(raw / step) * step
    }

    const handleDrag = (thumb) => (e) => {
        if (e.cancelable)
            e.preventDefault()

        const startX = e.clientX ?? e.touches?.[0]?.clientX

        const move = (moveEvent) => {
            const clientX = moveEvent.clientX ?? moveEvent.touches?.[0]?.clientX
            const deltaX = clientX - startX
            const trackLeft = trackRef.current.getBoundingClientRect().left
            const relativeX = clamp(clientX - trackLeft, 0, trackWidth)
            const newValue = clamp(positionToValue(relativeX), min, max)

            setRange((prev) => {
                if (thumb === 'min') {
                    const validMin = Math.min(newValue, prev.maxValue - step)
                    return { ...prev, minValue: validMin }
                } else {
                    const validMax = Math.max(newValue, prev.minValue + step)
                    return { ...prev, maxValue: validMax }
                }
            })
        }

        const up = () => {
            window.removeEventListener('mousemove', move)
            window.removeEventListener('mouseup', up)
            window.removeEventListener('touchmove', move)
            window.removeEventListener('touchend', up)
        }

        window.addEventListener('mousemove', move)
        window.addEventListener('mouseup', up)
        window.addEventListener('touchmove', move)
        window.addEventListener('touchend', up)
    }

    const handleInputChange = (type) => (e) => {
        const value = Number(e.target.value)
        setRange((prev) => {
            if (type === 'min') {
                return {
                    ...prev,
                    minValue: clamp(Math.min(value === 0 ? 1 : value, prev.maxValue - step), min, max)
                }
            } else {
                return {
                    ...prev,
                    maxValue: clamp(Math.max(value, prev.minValue + step), min, max)
                }
            }
        })
    }

    useEffect(() => { onValuesChange(range) }, [range])

    const minX = valueToPosition(range.minValue)
    const maxX = valueToPosition(range.maxValue)

    return (
        <div className={styles.wrapper}>
            <div className={styles.inputs}>
                <label className={styles.inputGroup}>
                    Мин. цена:
                    <input
                        type='number'
                        className={styles.inputField}
                        value={range.minValue}
                        onChange={handleInputChange('min')}
                        min={min}
                        max={range.maxValue - step}
                    />
                </label>
                <label className={styles.inputGroup}>
                    Макс. цена:
                    <input
                        type='number'
                        className={styles.inputField}
                        value={range.maxValue}
                        onChange={handleInputChange('max')}
                        min={range.minValue + step}
                        max={max}
                    />
                </label>
            </div>

            <div className={styles.track} ref={trackRef}>
                <div
                    className={styles.range}
                    style={{
                        left: `${minX}px`,
                        width: `${maxX - minX}px`
                    }}
                />
                <div
                    className={styles.thumb}
                    style={{ left: `${minX}px` }}
                    onMouseDown={handleDrag('min')}
                    onTouchStart={handleDrag('min')}
                    onMouseUp={() => onValuesChange((range))}
                />
                <div
                    className={styles.thumb}
                    style={{ left: `${maxX}px` }}
                    onMouseDown={handleDrag('max')}
                    onTouchStart={handleDrag('max')}
                    onMouseUp={() => onValuesChange((range))}
                />
            </div>
        </div>
    )
}

export default CustomRangeSelector
