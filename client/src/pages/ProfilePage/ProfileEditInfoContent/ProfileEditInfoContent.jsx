import styles from './ProfileEditInfoContent.module.css'


import SuggestionInput from '../../../components/SuggestionInput/SuggestionInput'
import Input from '../../../components/Input/Input'
import { useEffect, useState } from 'react'
import { usePostInfo } from '@hooks/usePostInfo'
import { useSelector } from 'react-redux'

import SkeletonLadingShimmer from '../../../components/SkeletonLadingShimmer/SkeletonLadingShimmer'
import EmptyPlaceholder from '../../../components/EmptyPlaceholder/EmptyPlaceholder'

export default function ProfileEditInfoContent({ onChangeInfo, validationErrors }) {
    const userData = useSelector((state => state.user.userData))
    const [userInfo, setUserInfo] = useState({ phone: null, email: null, city: null, postOffice: null })
    const { postOfficeData, cities, isCitiesLoading, isDepartmentsLoading, error, refetch } = usePostInfo({ selectedCity: userInfo?.city })

    useEffect(() => {
        const { fio, phone, email, city, postOffice } = userData || {}
        setUserInfo({ fio, phone, email, city, postOffice })
    }, [userData])

    useEffect(() => {
        onChangeInfo({ userInfo, isPostDataLoading: { isCitiesLoading, isDepartmentsLoading } })
    }, [userInfo, isCitiesLoading, isDepartmentsLoading])

    return (
        <section className={styles['edit-info']}>
            {!isCitiesLoading && !error ? <div className={styles['edit-info__field']}>
                <p className={styles['edit-info__field-name']}>Телефон:</p>
                <Input
                    className={styles['edit-info__input']}
                    type='tel'
                    placeholder='0123456789'
                    errorFrame={validationErrors?.find(error => error.path === 'phone')}
                    value={userInfo.phone}
                    onChange={(value) => setUserInfo(prev => ({ ...prev, phone: value }))} />
            </div> : <SkeletonLadingShimmer style={{ width: '100%', height: '53px' }} />}

            {!isCitiesLoading && !error ? <div className={styles['edit-info__field']}>
                <p className={styles['edit-info__field-name']}>Электронная почта:</p>
                <Input className={styles['edit-info__input']}
                    type='email'
                    placeholder='example@mail.com'
                    errorFrame={validationErrors?.find(error => error.path === 'email')}
                    value={userInfo.email}
                    onChange={(value) => setUserInfo(prev => ({ ...prev, email: value }))} />
            </div> : <SkeletonLadingShimmer style={{ width: '100%', height: '53px' }} />}

            <div className={styles['edit-info__field']}>
                {!isCitiesLoading && !error ? <p className={styles['edit-info__field-name']}>Отделение почты:</p> :
                    <SkeletonLadingShimmer style={{ width: '100%', height: '21px' }} />}

                {!isCitiesLoading && !error ? <SuggestionInput
                    className={styles['edit-info__input']}
                    type='text'
                    value={userInfo.city}
                    placeholder='Город'
                    errorFrame={validationErrors?.find(error => error === 'city')}
                    optionsList={cities.map(c => c.title)}
                    onValueSelect={(value) => setUserInfo(prev => ({ ...prev, city: value, postOffice: '' }))}
                /> : <SkeletonLadingShimmer style={{ width: '100%', height: '53px' }} />}
                {!isDepartmentsLoading && !error && !isCitiesLoading ? <SuggestionInput
                    className={styles['edit-info__input']}
                    type='text'
                    placeholder='Отделение №1, адрес'
                    errorFrame={validationErrors?.find(error => error === 'postOffice')}
                    value={userData?.city === userInfo?.city ? userInfo?.postOffice : ''}
                    onValueSelect={(value) => setUserInfo(prev => ({ ...prev, postOffice: value }))}
                    optionsList={postOfficeData?.departments} />
                    : <SkeletonLadingShimmer style={{ width: '100%', height: '53px' }} />}
            </div>
            {error && <EmptyPlaceholder title='Не удалось загрузить данные.' actionTitle='Попробовать снова.' action={refetch} />}
        </section>
    )
}
