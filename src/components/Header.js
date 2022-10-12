import { useContext, useState } from 'react'
import { AppContext } from '../App'
import { Button } from 'semantic-ui-react'
import url from '../url'
import '../css/Header.css'

const Header = () => {
  const { userID, setUserID, setMovieList, setSingleMovie, setSearch, openLogin, setOpenLogin } = useContext(AppContext)
  
  const [title, setTitle] = useState('')

  const backToMain = () => {
    setMovieList([])
    setSingleMovie(null)
    setSearch(false)
  }

  const search = async () => {
    if (!title) return
    const result = await fetch(`${url}/movie/search/${title}`)
    setMovieList(await result.json())
    setSearch(true)
    setTitle('')
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
          onClick={() => !userID
          ?
          setOpenLogin(!openLogin.open
            ? { open: true, form: 'login' }
            : { open: false })
          :
          setUserID(null)}>
          {!userID ? 'Log in' : 'Log out'}
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