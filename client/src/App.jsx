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

import { useDispatch, useSelector } from 'react-redux'
import { closeAll, closeBurger } from './features/uiSlice'
import { checkToken, setUserData } from './features/userSlice'
import { useEffect, useState } from 'react'

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
    dispatch(checkToken())
    tokenStatus && dispatch(setUserData())
    // tokenStatus && dispatch(setCartItems())
    console.log(`token stuts: ${tokenStatus}`)

    return () => dispatch(setUserData())
  }, [tokenStatus, localToken, dispatch])

  useEffect(() => {
    const handleScroll = () => dispatch(closeBurger())
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])


  return (
    <>
      <Layout >
        <Routes>
          {useSelector((state) => state.user.isTokenValid) && <>
            <Route path='/profile' element={<ProfilePage />}></Route>
            <Route path='/order' element={<OrderPage />}></Route>
            <Route path='/favorites' element={<FavoritesPage />}></Route>
            <Route path='/payment' element={<PaymentPage />}></Route>
          </>}
          <Route path='/' element={<MainPage />}></Route>
          <Route path='/auth' element={<AuthPage />}></Route>
          <Route path='/about' element={<AboutPage />}></Route>
          <Route path='/delivery-and-pay' element={<DeliveryPayPage />}></Route>
          <Route path='/guarantees' element={<GuaranteesPage />}></Route>
          <Route path='/contacts' element={<ContactsPage />}></Route>
          <Route path='/cart' element={<CartPage />}></Route>
          <Route path='/products' element={<ProductsPage />}></Route>
          <Route path='/products/:id' element={<ProductPage />}></Route>
        </Routes>
      </Layout >
    </ >
  )
}

export default App
