import { useContext, useEffect, useRef, useState } from 'react'
import { Button, Icon, Input } from 'semantic-ui-react'
import { AppContext } from '../App'
import url from '../url'
import '../css/Login.css'

const Login = () => {
  const { setUser, singleMovie, setRated, setOpenLogin } = useContext(AppContext)

  const userError = useRef(null)
  const passwordError = useRef(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const resetLabels = () => {
    userError.current.style.display = 'none'
    passwordError.current.style.display = 'none'
  }

  useEffect(() => {
    resetLabels()
  }, [])

  const getRateInfo = (movieID, userID) => {
    fetch(`${url}/movierating/${movieID}/${userID}`)
    .then(response => response.json())
    .then(text => {
      setRated(Boolean(text))
    })
  }

  const login = async () => {
    if(!username || !password) return

    resetLabels()

    fetch(`${url}/user/${username}/${password}`)
    .then(response => response.json())
    .then(userinfo => {
      if (userinfo.error.startsWith('The username')) {
        setErrorMessage(userinfo.error)
        userError.current.style.display = 'flex'
        return
      }

      if (userinfo.error.startsWith('The password')) {
        setErrorMessage(userinfo.error)
        passwordError.current.style.display = 'flex'
        return
      }

      setUser(userinfo)
      setOpenLogin(false)
      singleMovie && getRateInfo(singleMovie.idmovie, userinfo.userID)
      localStorage.setItem('TOKEN', userinfo.token)
    })
  }
  
  return (
    <div className='loginForm'>
      <div
        onClick={() => setOpenLogin(false)}
        className='closeLogin'>
        <Icon name='x' />
      </div>

      <h2>Log in</h2>

      <Input
        placeholder='Username'
        onChange={(event) => setUsername(event.target.value)}
        value={username}
        size='big'
      />
      
      <div className='error'>
        <div className='er ui pointing red label'
          ref={userError}>
          {errorMessage}
        </div>
      </div>

      <Input
        placeholder='Password'
        onChange={(event) => setPassword(event.target.value)}
        value={password}
        size='big'
        type='password'
      />
      
      <div className='error'>
        <div className='er ui pointing red label'
          ref={passwordError}>
          {errorMessage}
        </div>
      </div>

      <Button
        onClick={login}
        style={{
          width: '100%',
          background: 'rgb(0, 180, 150)',
          color: 'white'
        }}>LOG IN
      </Button>
    </div>
  )
}

export default Login