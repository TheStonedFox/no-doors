import { useEffect, useState } from 'react'

export const usePostInfo = ({ selectedCity }) => {
    const [postOfficeData, setPostOfficeData] = useState({ city: null, departments: [] })
    const [cities, setCities] = useState([])
    const [isCitiesLoading, setIsCitiesLoading] = useState(false)
    const [isDepartmentsLoading, setIsDepartmentsLoading] = useState(false)

    // Загружаем список городов
    useEffect(() => {
        setIsCitiesLoading(true)
        fetch('https://api.novaposhta.ua/v2.0/json/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                apiKey: import.meta.env.VITE_NOVA_POSHTA_API_KEY,
                modelName: 'Address',
                calledMethod: 'getCities',
            })
        })
            .then(res => res.json())
            .then(data => {
                const citiesData = data.data
                    ?.filter(city => city.SettlementTypeDescription === 'місто')
                    .map(city => ({ cityRef: city.Ref, title: city.Description }))
                setCities(citiesData || [])
            })
            .finally(() => setIsCitiesLoading(false))
    }, [])

    // Загружаем отделения для выбранного города
    useEffect(() => {
        if (!selectedCity || cities.length === 0) return

        const selectedCityRef = cities.find(c => c.title === selectedCity)?.cityRef
        if (!selectedCityRef) return

        setIsDepartmentsLoading(true)
        fetch('https://api.novaposhta.ua/v2.0/json/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                apiKey: import.meta.env.VITE_NOVA_POSHTA_API_KEY,
                modelName: 'Address',
                calledMethod: 'getWarehouses',
                methodProperties: {
                    CityRef: selectedCityRef,
                }
            })
        })
            .then(res => res.json())
            .then(json => {
                const departments = json.data
                    ?.filter(d => d.CategoryOfWarehouse === 'Branch')
                    .map(d => d.Description) || []

                setPostOfficeData(prev => ({ ...prev, departments }))
            })
            .finally(() => setIsDepartmentsLoading(false))
    }, [selectedCity, cities])

    return [postOfficeData, cities, isCitiesLoading, isDepartmentsLoading]
}
