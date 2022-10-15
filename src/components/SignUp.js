import { useContext, useEffect, useRef, useState } from 'react'
import { Button, Icon, Input } from 'semantic-ui-react'
import { AppContext } from '../App'
import url from '../url'
import '../css/Login.css'

const Login = () => {
  const { setUser, setOpenLogin } = useContext(AppContext)

  const userError = useRef(null)

  const [username, setUsername] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const reset = () => {
    userError.current.style.display = 'none'
    setUsername('')
    setFirstname('')
    setLastname('')
    setPassword('')
  }

  useEffect(() => {
    reset()
  }, [])

  const getUser = () => {
    fetch(`${url}/user/${username}/${password}`)
    .then(response => response.json())
    .then(newUser => {
      setUser(newUser)
      localStorage.setItem('TOKEN', newUser.token)
      setOpenLogin(false)
      reset()
    })
  }

  const newAccount = async () => {
    if(!username || !firstname || ! lastname || !password) return

    fetch(`${url}/user`, {
      method: 'POST',
      headers: { 'content-type' : 'application/json' },
      body: JSON.stringify({
        username: username,
        firstname: firstname,
        lastname: lastname,
        password: password
      })
    })
    .then(response => response.text())
    .then(text => {
      if (text.startsWith('The')) {
        setErrorMessage(text)
        userError.current.style.display = 'flex'
        return
      }
      
      getUser()
    })
  }
  
  return (
    <div className='loginForm'>
      <div
        onClick={() => {
          setOpenLogin(false)
          reset()
        }}
        className='closeLogin'>
        <Icon name='x' />
      </div>

      <h2>Sign up</h2>

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

      <div className='signinput'>
        <Input
          placeholder='Firstname'
          onChange={(event) => setFirstname(event.target.value)}
          value={firstname}
          size='big'
        />
      </div>

      <div className='signinput'>
        <Input
          placeholder='Lastname'
          onChange={(event) => setLastname(event.target.value)}
          value={lastname}
          size='big'
        />
      </div>

      <div className='signinput'>
        <Input
          placeholder='Password'
          onChange={(event) => setPassword(event.target.value)}
          value={password}
          size='big'
          type='password'
        />
      </div>

      <Button
        onClick={newAccount}
        style={{
          width: '100%',
          background: 'rgb(0, 180, 150)',
          color: 'white'
        }}>CREATE NEW ACCOUNT
      </Button>
    </div>
  )
}

export default Login