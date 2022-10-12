import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../App'
import { Button } from 'semantic-ui-react'
import url from '../url'
import '../css/SideBar.css'

const SideBar = () => {
  const { movieList, setSingleMovie, setActors, setRatings, search, setOpenMovieModal, setLoading } = useContext(AppContext)

  const [quote, setQuote] = useState(null)

  useEffect(() => {
    const getQuote = async () => {
      const result = await fetch(`${url}/quote`)
      setQuote(await result.json())
    }

    getQuote()
  }, [])

  const getMovie = async (id) => {
    setLoading(true)

    const movie = await fetch(`${url}/movie/${id}`)
    setSingleMovie(await movie.json())

    const getActors = await fetch(`${url}/actor?id=${id}`)
    setActors(await getActors.json())

    const getRatings = await fetch(`${url}/rating?id=${id}`)
    setRatings(await getRatings.json())

    setLoading(false)
  }
  
  return (
    <div className='sideBar'>
      <div className='sideBarChild'>
        
        <div className='textBlock'>
          {search ? 'Search result' : 'Quote of the day'}
        </div>

        <div className='results'>
          {movieList.length > 0
          ?
          movieList.map((movie, i) =>
          <li
            key={i}
            onClick={() => getMovie(movie.idmovie)}>
            <span className='link'>{movie.title}</span>
          </li>)
          :
          search
          ?
          <i>No matches found</i>
          :
          <>

          {quote &&
          <>
            <div className='quote'>
              <span>" </span>{quote.quote}<span> "</span>
            </div>
            <div className='quoteInfo'>
              - {quote.movie} ({quote.year})
            </div>
          </>
          }
          
          </>}
        </div>

        <div className='addButton'>
          <Button
            onClick={() => setOpenMovieModal({ open: true, form: 'new' })}
            style={{ width: '100%' }}>
            ADD NEW MOVIE
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SideBar