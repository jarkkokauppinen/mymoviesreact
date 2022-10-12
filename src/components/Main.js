import { useContext } from 'react'
import { AppContext } from '../App'
import Image from './Image'
import Movie from './Movie'
import SideBar from './SideBar'
import '../css/Main.css'

const Main = () => {
  const { singleMovie } = useContext(AppContext)

  return (
    <div className='main'>
      {!singleMovie ? <Image /> : <Movie />}
      <SideBar />
    </div>
  )
}

export default Main