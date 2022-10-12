import { useContext, useState } from 'react'
import { Button, Icon, Input } from 'semantic-ui-react'
import { AppContext } from '../App'
import url from '../url'
import '../css/Login.css'

const Login = () => {
  const { setUserID, setOpenLogin, setMessage, note } = useContext(AppContext)

  const [username, setUsername] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [password, setPassword] = useState('')

  const getUser = async () => {
    const newUserID = await fetch(`${url}/user/${username}/${password}`)
    setUserID(Number(await newUserID.text()))
    setOpenLogin(false)
    setUsername('')
    setFirstname('')
    setLastname('')
    setPassword('')
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
        setMessage(text)
        note.current.style.display = 'flex'
        setTimeout(() => {
          note.current.style.display = 'none'
        }, 5000)
      } else {
        getUser()
      }
    })
  }
  
  return (
    <div className='loginForm'>
      <div
        onClick={() => setOpenLogin(false)}
        className='closeLogin'>
        <Icon name='x' />
      </div>

      <h2>Sign up</h2>

      <div className='input'>
        <Input
          placeholder='Username'
          onChange={(event) => setUsername(event.target.value)}
          value={username}
          size='big'
        />
      </div>

      <div className='input'>
        <Input
          placeholder='Firstname'
          onChange={(event) => setFirstname(event.target.value)}
          value={firstname}
          size='big'
        />
      </div>

      <div className='input'>
        <Input
          placeholder='Lastname'
          onChange={(event) => setLastname(event.target.value)}
          value={lastname}
          size='big'
        />
      </div>

      <div className='input'>
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