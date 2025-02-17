import './App.css'
import './global.css'

import { Routes, Route } from 'react-router-dom'

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

import { useDispatch } from 'react-redux'
import { closeAll } from './features/ui/uiSlice'

function App() {

  const dispatch = useDispatch()
  const isLogin = true
  window.addEventListener('scroll', () => dispatch(closeAll()))
  return (
    <>
      <Layout >
        {isLogin ? <Routes>
          <Route path='/' element={<MainPage />}></Route>
          <Route path='/about' element={<AboutPage />}></Route>
          <Route path='/delivery-and-pay' element={<DeliveryPayPage />}></Route>
          <Route path='/guarantees' element={<GuaranteesPage />}></Route>
          <Route path='/contacts' element={<ContactsPage />}></Route>
          <Route path='/profile' element={<ProfilePage />}></Route>
          <Route path='/favorite' element={<FavoritesPage />}></Route>
          <Route path='/cart' element={<CartPage />}></Route>
        </Routes> :
          <Routes>
            <Route path='/' element={<MainPage />}></Route>
            <Route path='/about' element={<AboutPage />}></Route>
            <Route path='/delivery-and-pay' element={<DeliveryPayPage />}></Route>
            <Route path='/guarantees' element={<GuaranteesPage />}></Route>
            <Route path='/contacts' element={<ContactsPage />}></Route>
            <Route path='/profile' element={<AboutPage />}></Route>
            <Route path='/auth' element={<AuthPage />}></Route>
            <Route path='/favorite' element={<FavoritesPage />}></Route>
            <Route path='/cart' element={<CartPage />}></Route>
          </Routes>}

      </Layout >
    </ >
  )
}

export default App
