import { useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppContext } from '../App'
import Header from './Header'
import Image from './Image'
import Movie from './Movie'
import SideBar from './SideBar'
import '../css/Main.css'

const Main = () => {
  const { singleMovie } = useContext(AppContext)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/movie/:id'
          element={
          <>
            <Header />
            <div className='main'>
              <Movie />
              <SideBar />
            </div>
          </>}>
        </Route>
        
        <Route
          path='/search/:title'
          element={
          <>
            <Header />
            <div className='main'>
              {singleMovie ? <Movie /> : <Image />}
              <SideBar />
            </div>
          </>}>
        </Route>

        <Route
          path='/'
          element={
            <>
              <Header />
              <div className='main'>
                <Image />
                <SideBar />
              </div>
            </>}>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Main