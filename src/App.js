import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [movie, setMovie] = useState()

  const getMovie = async () => {
    const url = process.env.REACT_APP_BASE_URL
    const movie = await fetch(`${url}/movie/1`)
    setMovie(await movie.json())
  }

  console.log(movie)

  useEffect(() => {
    getMovie()
  }, [])

  return (
    <div>
      mymovies
    </div>
  );
}

export default App
