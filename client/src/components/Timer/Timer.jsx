import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import styles from './Timer.module.css'
import Button from '../../components/Button/Button'

function Timer({ timerValue, onRestart, onTimerEnd }) {
    const [totalSeconds, setTotalSeconds] = useState(timerValue)
    const [time, setTime] = useState({ minutes: 0, seconds: 0 })
    const intervalRef = useRef(null)

    const startInterval = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }

        intervalRef.current = setInterval(() => {
            setTotalSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }, [])


    useEffect(() => {
        startInterval()
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [startInterval])


    useEffect(() => {
        setTotalSeconds(timerValue)
    }, [timerValue])

    useEffect(() => {
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        setTime({ minutes, seconds })

        if (totalSeconds === 0 && onTimerEnd) onTimerEnd()

    }, [totalSeconds, onTimerEnd])

    return (
        <>
            <section className={styles['timer']}>
                {`0${time.minutes}:${time.seconds < 10 ? `0${time.seconds}` : time.seconds}`}
            </section>

            <Button
                title='Отправить еще раз'
                disabled={totalSeconds > 0}
                onClick={() => {
                    setTotalSeconds(timerValue)
                    startInterval()
                    onRestart && onRestart()
                }}
            />
        </>
    )
}

export default memo(Timer)
