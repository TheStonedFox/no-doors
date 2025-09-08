import { useEffect, useState } from "react"
import styles from './BrandTree.module.css'

import deviceTypeEnTitle from '../../utils/deviceTypeEnTitle.js'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toggleCatalog } from "../../redux/features/uiSlice"

import { generateId } from '../../utils/generateId.js'

import ArrowIcon from '../../svg/ArrowIcon.jsx'

export default function BrandTree({ brand, isOpen, onChange }) {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { categories } = useSelector(state => state.shared.chooseValues)
    const [step, setStep] = useState('')
    const [open, setOpen] = useState(isOpen)
    const [selected, setSelected] = useState({ type: '', model: '', category: '' })

    const onModelItemClick = (title) => {
        setSelected(prev => ({ ...prev, model: title }))
    }

    const onTypeItemClick = (title) => {
        setStep('model')
        setSelected(prev => ({ ...prev, type: selected.type !== title ? title : '' }))
    }

    const onCategoryItemClick = (category) => {
        setSelected(prev => ({ ...prev, category }))
    }

    useEffect(() => {
        if (selected.category) {
            navigate(`/search?brand=${brand?.title}&model=${selected.model}&category=${selected.category}&deviceType=${deviceTypeEnTitle[selected.type]}`)
            setSelected({})
            dispatch(toggleCatalog())
            setOpen(false)
            onChange(null)
        }
    }, [selected])

    return (
        <ul className={styles['brand-tree']}>
            <h3 className={styles['title']} style={open ? { marginBottom: '15px' } : {}}>
                {step !== 'type' && open && <ArrowIcon style={{ transform: 'rotate(180deg)' }} />}
                {!selected.type && <h3 onClick={() => {
                    setStep(open ? '' : 'type')
                    onChange(brand?.title)
                    setSelected({})
                    setOpen(open ? false : true)
                }}>{brand?.title}</h3>}

                {step === 'model' && !selected.model && <h3 onClick={() => {
                    setStep('type')
                    setSelected(prev => ({ ...prev, model: '', type: '' }))
                }}>{deviceTypeEnTitle[selected.type]}</h3>}
                {selected.model && <h3 onClick={() => {
                    setStep('model')
                    setSelected(prev => ({ ...prev, model: '' }))
                }}>{selected.model}</h3>}
            </h3>
            {Object.entries(brand || {}).map(type => Array.isArray(type[1]) &&
                <div className={styles['types-list']} key={generateId()} style={{ maxHeight: open ? '10000px' : '0', transition: '0.2s' }}>
                    {!selected.type && <p onClick={() => onTypeItemClick(type[0])}>{deviceTypeEnTitle[type[0]]}</p>}

                    <ul className={styles['models-list']} style={{ maxHeight: step === 'model' && selected.type === type[0] ? '10000px' : '0px', transition: '0.2s' }}>
                        {type[1].map(model =>
                            <li style={{ maxHeight: step === 'model' ? '1000px' : '0px', transition: '0.2s' }}
                                onClick={() => onModelItemClick(model.title)} key={generateId()}>

                                {!selected.model ? <p>{model.title}</p> : null}

                                <ul className={styles['categories-list']} style={{ maxHeight: selected.model === model.title ? '1000px' : '0px', transition: '0.2s' }}>
                                    {selected.model === model.title && categories.map(category => <p onClick={() => onCategoryItemClick(category)} key={generateId()}>{category}</p>)}
                                </ul>
                            </li>)}
                    </ul>
                </div>)
            }
        </ul >
    )
}
