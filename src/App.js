import { createContext, useEffect, useRef, useState } from 'react'
import Main from './components/Main'
import Login from './components/Login'
import SignUp from './components/SignUp'
// import MovieModal from './components/MovieModal'
import './App.css'

export const AppContext = createContext()

function App() {
  const [user, setUser] = useState(null)
  const [movieList, setMovieList] = useState([])
  const [singleMovie, setSingleMovie] = useState(null)
  const [actors, setActors] = useState([])
  const [ratings, setRatings] = useState(null)
  const [rated, setRated] = useState(false)
  const [search, setSearch] = useState(false)
  const [openLogin, setOpenLogin] = useState({ open: false, form: 'login' })
  const [openMovieModal, setOpenMovieModal] = useState({ open: false, form: '' })
  const [openRateForm, setOpenRateForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const login = useRef(null)
  const note = useRef(null)

  useEffect(() => {
    openLogin.open
    ? login.current.style.display = 'flex'
    : login.current.style.display = 'none'
  }, [openLogin])

  useEffect(() => {
    note.current.style.display = 'none'
  }, [])
  
  return (
    <AppContext.Provider value={{
      user,
      setUser,
      movieList,
      setMovieList,
      singleMovie,
      setSingleMovie,
      actors,
      setActors,
      ratings,
      setRatings,
      rated,
      setRated,
      search,
      setSearch,
      openLogin,
      setOpenLogin,
      openMovieModal,
      setOpenMovieModal,
      openRateForm,
      setOpenRateForm,
      loading,
      setLoading,
      setMessage,
      note
      }}>
      <div className='base'>

        <div className='content'>
          <Main />
        </div>
        
        <div ref={login} className='sign'>
          {openLogin.form === 'login' ? <Login /> : <SignUp />}
        </div>
      </div>

      <div className='message' ref={note}>
        <div className='ui negative message'>{message}</div>
      </div>
    </AppContext.Provider>
  )
}

export default App
