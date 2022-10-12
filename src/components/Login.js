import { useContext, useState } from 'react'
import { Button, Icon, Input } from 'semantic-ui-react'
import { AppContext } from '../App'
import url from '../url'
import '../css/Login.css'

const Login = () => {
  const { setUserID, setOpenLogin, setMessage, note } = useContext(AppContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = async () => {
    if(!username || !password) return

    fetch(`${url}/user/${username}/${password}`)
    .then(response => response.text())
    .then(text => {
      if (text.startsWith('The')) {
        setMessage(text)
        note.current.style.display = 'flex'
        setTimeout(() => {
          note.current.style.display = 'none'
        }, 5000)
      } else {
        setUserID(Number(text))
        setOpenLogin(false)
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

      <h2>Log in</h2>

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
          placeholder='Password'
          onChange={(event) => setPassword(event.target.value)}
          value={password}
          size='big'
          type='password'
        />
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