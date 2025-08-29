import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'

import './App.css'
import './global.css'

//#region pages imports
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
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage'
import CommentsPage from './pages/CommentsPage/CommentsPage'
import CommentPage from './pages/CommentPage/CommentPage'
//#endregion

import { useDispatch, useSelector } from 'react-redux'
import { closeBurger } from './redux/features/uiSlice'
import { checkTokenThunk, resetUser, setUserData } from './redux/features/userSlice'
import { useEffect, useState } from 'react'
import { getChooseValues } from './redux/features/sharedSlice'

function App() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const tokenStatus = useSelector((state) => state.user.isTokenValid)
  const [localToken, setLocalToken] = useState()

  window.addEventListener('storage', (e) => {
    if (e.key === 'token' && !localStorage.getItem('token') || e.key === 'token' && !sessionStorage.getItem('token'))
      navigate('/')
    if (e.key === 'token')
      setLocalToken(localStorage.getItem('token') || sessionStorage.getItem('token'))

  })

  useEffect(() => {
    dispatch(checkTokenThunk())
  }, [dispatch])

  useEffect(() => {
    if (tokenStatus) {
      dispatch(setUserData())
    } else {
      dispatch(resetUser())
    }
  }, [tokenStatus, dispatch, localToken])

  useEffect(() => {
    dispatch(getChooseValues())
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
          {tokenStatus ? <>
            <Route path='/profile' element={<ProfilePage />}></Route>
            <Route path='/profile/viewed-products' element={<ViewedProductsPage />}></Route>
            <Route path='/order' element={<OrderPage />}></Route>
            <Route path='/favorites' element={<FavoritesPage />}></Route>
            <Route path='/payment' element={<PaymentPage />}></Route>
            <Route path='/cart' element={<CartPage />}></Route>
          </> : null}
          <Route path='/' element={<MainPage />}></Route>
          <Route path='/profile' element={<AuthPage />}></Route>
          <Route path='/auth' element={<AuthPage />}></Route>
          <Route path='/cart' element={<AuthPage />}></Route>
          {!tokenStatus ? <Route path='/auth/reset-password/' element={<ResetPasswordPage />}></Route> : null}
          <Route path='/about' element={<AboutPage />}></Route>
          <Route path='/delivery-and-pay' element={<DeliveryPayPage />}></Route>
          <Route path='/guarantees' element={<GuaranteesPage />}></Route>
          <Route path='/contacts' element={<ContactsPage />}></Route>
          <Route path='/products' element={<ProductsPage />}></Route>
          <Route path='/products/:id' element={<ProductPage />}></Route>
          <Route path='/search' element={<SearchPage />}></Route>
          <Route path='/products/:productId/comments' element={<CommentsPage />}></Route>
          <Route path='/comments/:commentId' element={<CommentPage />}></Route>

          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </Layout >
    </ >
  )
}

export default App
