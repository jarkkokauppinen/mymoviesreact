import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../App'
import { Button } from 'semantic-ui-react'
import url from '../url'
import '../css/Header.css'

const Header = () => {
  const { user, setUser, setMovieList, setSingleMovie, setSearch, openLogin, setOpenLogin } = useContext(AppContext)
  
  const [title, setTitle] = useState('')

  const navigate = useNavigate()

  const backToMain = () => {
    setMovieList([])
    setSingleMovie(null)
    setSearch(false)
    navigate('/')
  }

  const search = async () => {
    if (!title) return
    const result = await fetch(`${url}/movie/search/${title}`)
    setMovieList(await result.json())
    setSearch(true)
    setTitle('')
    navigate(`/search/${title}`)
  }

  const getIn = () => {
    setOpenLogin(!openLogin.open
    ? { open: true, form: 'login' }
    : { open: false })
  }

  const getOut = () => {
    setUser(null)
    setSingleMovie(null)
    setMovieList([])
    setSearch(false)
    localStorage.clear()
    navigate('/')
  }

  return (
    <div className='header'>
      <div className='items'>
        
        <div
          className='logo center'
          onClick={backToMain}>myMovies
        </div>
        
        <div className='textField'>
          <input
            className='text'
            placeholder='Search movie'
            onChange={(event) => setTitle(event.target.value)}
            value={title}>
          </input>
        </div>

        <div className='center'>
          <Button onClick={search}>SEARCH</Button>
        </div>
      </div>
      
      <div className='center'>
        <Button
          style={{
          background: 'rgb(55, 55, 55)',
          color: 'white' }}
          onClick={() => !user ? getIn() : getOut()}>
          {!user ? 'Log in' : 'Log out'}
        </Button>
        
        <Button
          style={{
          background: 'rgb(55, 55, 55)',
          color: 'white'}}
          onClick={() =>
            setOpenLogin(!openLogin.open
            ? { open: true, form: 'signUp'}
            : { open: false })}>
          Sign up
        </Button>
      </div>
    </div>
  )
}

export default Header