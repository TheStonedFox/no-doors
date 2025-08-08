import './App.css'
import './global.css'

import { Routes, Route, useNavigate } from 'react-router-dom'

import MainPage from './pages/MainPage/MainPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import AboutPage from './pages/AboutPage/AboutPage'
import DeliveryPayPage from './pages/DeliveryPayPage/DeliveryPayPage'
import GuaranteesPage from './pages/GuaranteesPage/GuaranteesPage'
import ContactsPage from './pages/ContactsPage/ContactsPage'
import Layout from './components/Layout/Layout'
import FavoritesPage from './pages/FavoritesPage/FavoritesPage'
import CartPage from './pages/CartPage/CartPage'
import AuthPage from './pages/AuthPage/AuthPage'
import ProductsPage from './pages/ProductsPage/ProductsPage'
import ProductPage from './pages/ProductPage/ProductPage'
import OrderPage from './pages/OrderPage/OrderPage'
import PaymentPage from './pages/PaymentPage/PaymentPage'
import ViewedProductsPage from './pages/ViewedProductsPage/ViewedProductsPage'
import SearchPage from './pages/SearchPage/SearchPage'

import { useDispatch, useSelector } from 'react-redux'
import { closeBurger } from './features/uiSlice'
import { checkTokenThunk, setUserData } from './features/userSlice'
import { useEffect, useState } from 'react'
import { getChooseValues } from './features/sharedSlice'

function App() {

  const dispatch = useDispatch()
  const tokenStatus = useSelector((state) => state.user.isTokenValid)
  const [localToken, setLocalToken] = useState()
  const negative = useNavigate()

  window.addEventListener('storage', (e) => {
    if (e.key === 'token' && !localStorage.getItem('token'))
      negative('/')
    if (e.key === 'token')
      setLocalToken(localStorage.getItem('token'))
  })

  useEffect(() => {
    dispatch(checkTokenThunk())

    tokenStatus && dispatch(setUserData())

    return () => dispatch(setUserData())
  }, [tokenStatus, localToken, dispatch])

  useEffect(() => {
    dispatch(getChooseValues())
    const handleScroll = () => dispatch(closeBurger())
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const isTokenValid = useSelector((state) => state.user.isTokenValid)
  return (
    <>
      <Layout >
        <Routes>
          {isTokenValid ? <>
            <Route path='/profile' element={<ProfilePage />}></Route>
            <Route path='/profile/viewed-products' element={<ViewedProductsPage />}></Route>
            <Route path='/order' element={<OrderPage />}></Route>
            <Route path='/favorites' element={<FavoritesPage />}></Route>
            <Route path='/payment' element={<PaymentPage />}></Route>
            <Route path='/cart' element={<CartPage />}></Route>
          </> : null}
          <Route path='/' element={<MainPage />}></Route>
          <Route path='/auth' element={<AuthPage />}></Route>
          <Route path='/cart' element={<AuthPage />}></Route>
          <Route path='/about' element={<AboutPage />}></Route>
          <Route path='/delivery-and-pay' element={<DeliveryPayPage />}></Route>
          <Route path='/guarantees' element={<GuaranteesPage />}></Route>
          <Route path='/contacts' element={<ContactsPage />}></Route>
          <Route path='/products' element={<ProductsPage />}></Route>
          <Route path='/products/:id' element={<ProductPage />}></Route>
          <Route path='/search' element={<SearchPage />}></Route>
        </Routes>
      </Layout >
    </ >
  )
}

export default App
