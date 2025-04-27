const getPrice = (discount, wholesalePrice, price) => {
    if (price)
        return discount > 0 ? Math.round(price - price / 100 * discount) : price

    if (wholesalePrice)
        return discount > 0 ? Math.round(wholesalePrice - wholesalePrice / 100 * discount) : wholesalePrice
}
export default getPrice


