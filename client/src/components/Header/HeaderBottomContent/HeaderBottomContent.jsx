import styles from './HeaderBottomContent.module.css'

import DropDownMenu from '../../DropDownMenu/DropDownMenu'
import MoreArrowIcon from '@/svg/MoreArrowIcon'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'




export default function HeaderBottomContent() {
    const { brands, categories, error: dropDownValuesError, isLoading: dropDownValuesLoadingStatus } = useSelector(state => state.shared.chooseValues)

    return (
        <section className={styles['header__bottom-content']}>
            <ul className={styles['header__brands-list']}>
                <li>
                    <DropDownMenu title='Apple' deviceTypes={['phones', 'tablets', 'watches']} brandModels={brands[0]} categories={categories} />
                </li>
                <li>
                    <DropDownMenu title='Huawei' deviceTypes={['phones', 'tablets', 'watches']} brandModels={brands[1]} categories={categories} />
                    <MoreArrowIcon />
                </li>
                <li>
                    <DropDownMenu title='Xiaomi' deviceTypes={['phones', 'tablets', 'watches']} brandModels={brands[2]} categories={categories} />
                    <MoreArrowIcon />
                </li>
                <li>
                    <DropDownMenu title='Samsung'
                        deviceTypes={['phones', 'tablets', 'watches']}
                        brandModels={brands[3]}
                        categories={categories} />
                    <MoreArrowIcon />
                </li>

                <li className={styles['brands-list__more-item']}>
                    <DropDownMenu title='Еще' list={['Питание и кабели', 'Powerbank', 'Акции', 'Прайс-лист']} />
                    <MoreArrowIcon />
                </li>
                {/* 
                <Link className={styles['brands-list__link']}>Питание и кабели</Link>
                <Link className={styles['brands-list__link']}>Powerbank</Link>
                <Link className={styles['brands-list__link']}>Акции</Link>
                <div className={styles['brands-list__link']}>
                    <Link className={styles['header__price-link']}>Прайс-лист</Link>
                </div> */}
            </ul>
        </section>

    )
}
