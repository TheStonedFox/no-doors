import { useEffect, useState } from 'react'
import styles from './DropDownMenu.module.css'
import { useNavigate } from 'react-router-dom'
import { IoChevronBackOutline } from "react-icons/io5"
import deviceTypesEnTitles from '@utils/deviceTypeEnTitle'
import { generateId } from '../../utils/generateId'

export default function DropDownMenu({ title, deviceTypes, brandModels, categories, list, className }) {
    const navigate = useNavigate()
    const [deviceType, setDeviceType] = useState()
    const [model, setModel] = useState()
    const [subtitle, setSubtitle] = useState(title)
    const [step, setStep] = useState('')
    const [isTouch, setIsTouch] = useState(false)

    const resetValues = () => {
        setStep('')
        setSubtitle(title)
        setModel()
        setDeviceType()
    }



    const onDropDownTitleClick = () => {

        if (step === 'model') {
            setDeviceType(null)
            setStep('type')
            setSubtitle(title)
        }

        if (step === 'category') {
            setModel(null)
            setStep('model')
            setSubtitle(deviceTypesEnTitles[deviceType])
        }

        if (step === 'type') setStep('')

        if (step === 'brand') setStep('close')

        if (step === '') setStep('type')

    }
    const onDropDownMouseEnter = () => {
        step === '' && !isTouch && setStep('type')
    }

    useEffect(() => {
        const handler = () => setIsTouch(true)
        document.addEventListener('touchstart', handler)

        return () => document.removeEventListener('touchstart', handler)
    }, [])
    return (
        <div tabIndex={1} className={`${styles['dropdown-menu']} ${step !== '' ? styles['open-drop-down'] : null} dropdown`}
            onMouseEnter={onDropDownMouseEnter} onMouseLeave={() => resetValues()}>
            <section className={styles['dropdown-menu__title']} onClick={() => onDropDownTitleClick()}>
                {step !== 'brand' && <IoChevronBackOutline
                    style={{ transform: step === 'type' ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.2s' }} />}
                <p>{subtitle}</p>
            </section>

            <div className={styles['dropdown-menu__content']}>
                {list && <section className={styles['dropdown-menu__list']} style={{ height: deviceType ? '0px' : '100%' }}>
                    {list?.map(item => <p
                        key={generateId()}
                        className={styles['dropdown-menu__device-type-item']}
                        onClick={() => {
                            resetValues()
                            item === 'Powerbank' && navigate('/search?category=Разное&word=Powerbank')
                            item === 'Питание и кабели' && navigate('/search?category=Разное&word=Кабель')
                            item === 'Акции' && navigate('/search?sortType=decreasingDiscount')
                            item === 'Прайс-лист' && alert('price')
                        }}>{item}</p>)}
                </section>}

                {deviceTypes && <section className={styles['dropdown-menu__list']} style={{ height: deviceType ? '0px' : '100%' }}>
                    {deviceTypes?.map(dt => <p
                        key={generateId()}
                        className={styles['dropdown-menu__device-type-item']}
                        onClick={() => {
                            setDeviceType(dt)
                            setSubtitle(deviceTypesEnTitles[dt])
                            setStep('model')
                        }}>{deviceTypesEnTitles[dt]}</p>)}
                </section>}

                {deviceType && <section className={styles['dropdown-menu__list']} style={{ height: model ? '0px' : '100%' }}>
                    {brandModels[deviceType]?.map(model => <p
                        key={generateId()}
                        className={styles['dropdown-menu__device-model-item']}
                        onClick={() => {
                            setModel(model.title)
                            setSubtitle(model.title)
                            setStep('category')
                        }}
                    >{model.title}</p>)}
                </section>}

                {model && <section className={`${styles['dropdown-menu__list']}`}>
                    {categories && categories?.map(category => <p
                        key={generateId()}
                        className={styles['dropdown-menu__category-item']}
                        onClick={() => {
                            navigate(`search?brand=${title}&model=${model}&category=${category}&deviceType=${deviceTypesEnTitles[deviceType]}`)
                            resetValues()
                        }}>{category}</p>)}
                </section>}

            </div>

        </div >
    )
}
