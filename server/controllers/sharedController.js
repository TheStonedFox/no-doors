import UtilityListsModel from '../models/UtilityListsModel.js'
export const getChooseSteps = async (req, res) => {
    try {
        const doc = await UtilityListsModel.findOne()
        if (!doc)
            return res.status(404).json({ message: 'Не удалось получить данные.' })

        res.status(200).json({ options: doc })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}
