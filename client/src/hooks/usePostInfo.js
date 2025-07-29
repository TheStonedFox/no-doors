import { useEffect, useState } from "react"

export const usePostInfo = ({ selectedCity }) => {
    // alert(selectedCity)
    const [postOfficeData, setPostOfficeData] = useState({ city: null, departments: [] })

    const [cities, setCities] = useState([{ cityRef: null, title: null }])

    useEffect(() => {
        fetch("https://api.novaposhta.ua/v2.0/json/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                apiKey: import.meta.env.VITE_NOVA_POSHTA_API_KEY,
                modelName: "Address",
                calledMethod: "getCities",
            })
        })
            .then(res => res.json())
            .then(data => {
                const citiesData = data.data?.filter(city => city.SettlementTypeDescription === 'місто').map(city => {
                    return { cityRef: city.Ref, title: city.Description }
                })
                setCities(citiesData)
            })
    }, [])

    useEffect(() => {
        if (!cities.find(city => city.title === selectedCity))
            return

        fetch("https://api.novaposhta.ua/v2.0/json/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                apiKey: import.meta.env.VITE_NOVA_POSHTA_API_KEY,
                modelName: "Address",
                calledMethod: "getWarehouses",
            })
        })
            .then(res => res.json())
            .then(json => {
                const departments = json.data.
                    filter(department => department.CityRef === cities.find(city => city.title === selectedCity)?.cityRef &&
                        department.CategoryOfWarehouse === 'Branch').map(department => department.Description)
                setPostOfficeData(prev => ({ ...prev, departments: departments }))
            })
    }, [selectedCity])

    return [postOfficeData, cities]
}