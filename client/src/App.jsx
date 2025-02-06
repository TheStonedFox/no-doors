import './App.css'
import './global.css'

import { Routes, Route } from 'react-router-dom'

import MainPage from './pages/MainPage/MainPage'
import ProfilePage from './pages/ProfilePage'

import Layout from './components/Layout/Layout'

function App() {

  return (
    <>
      <Layout>
        <Routes>
          <Route path='/' element={<MainPage></MainPage>}></Route>
          <Route path='/profile' element={<ProfilePage></ProfilePage>}></Route>
        </Routes>
      </Layout>
    </>
  )
}

export default App
