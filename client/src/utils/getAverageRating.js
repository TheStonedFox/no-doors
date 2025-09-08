export const getAverageRating = (starsValues) => {
    const entries = Object.entries(starsValues || {})
    const reviewsTotal = entries.reduce((acc, i) => acc + i[1], 0)
    return (entries.reduce((acc, i) => acc + i[0] * i[1], 0) / reviewsTotal).toFixed(1)
}