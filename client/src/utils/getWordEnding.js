const getWordEnding = (value) => {
    if (value % 100 >= 11 && value % 100 <= 14) return 'ов'
    if (value % 10 === 1) return ''
    if (value % 10 >= 2 && value % 10 <= 4) return 'а'
    return "ов"
}
export default getWordEnding