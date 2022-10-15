import ReactDOM from 'react-dom'
import App from '../App'
import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'

test('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})

test('renders logo', () => {
  render(<App />)
  expect(screen.getByText('myMovies')).toBeInTheDocument()
})

test('opens sign up bar', () => {
  render(<App />)

  const button = screen.getByText('Sign up')
  fireEvent.click(button)

  expect(screen.getByText('CREATE NEW ACCOUNT')).toBeInTheDocument()
})