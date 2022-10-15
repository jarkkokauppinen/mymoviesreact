import { useContext } from 'react'
import { AppContext } from '../App'
import { Button, Dimmer, Icon, Loader } from 'semantic-ui-react'
import RateModal from './RateModal'
import url from '../url'
import '../css/Movie.css'

const Movie = () => {
  const { user, setMovieList, singleMovie, setSingleMovie, actors, ratings, rated, setSearch, setOpenRateForm, setOpenMovieModal, loading, setMessage, note } = useContext(AppContext)

  if (loading) {
    return (
      <div className='movie'>
        <Dimmer active style={{ background: 'rgb(55, 55, 55)' }}>
          <Loader />
        </Dimmer>
      </div>
    )
  }

  const deleteMovie = async () => {
    const id = singleMovie.idmovie

    await fetch(`${url}/movie?id=${id}`, { method: 'DELETE' })
    await fetch(`${url}/movieactor/${id}`, { method: 'DELETE' })
    await fetch(`${url}/rating?id=${id}`, { method: 'DELETE' })
    await fetch(`${url}/movierating/${id}`, { method: 'DELETE' })

    setSingleMovie(null)
    setMovieList([])
    setSearch(false)
  }

  const canRate = () => {
    if (rated) {
      setMessage('You have already rated this movie')
      note.current.style.display = 'flex';
      setTimeout(() => {
        note.current.style.display = 'none'
      }, 5000)
    } else {
      setOpenRateForm(true)
    }
  }

  const cannotRate = () => {
    setMessage('Log in to rate')
    note.current.style.display = 'flex';
    setTimeout(() => {
      note.current.style.display = 'none'
    }, 5000)
  }
  
  return (
    <div className='movie'>
      <div className='moviecontent'>
        <div>
          <div>
            {singleMovie.image === 'no'
            ?
            <div className='cover'>NO IMAGE</div>
            :
            <img className='cover' src={`${url}/images/${singleMovie.image}`} alt='movie'></img>}
          </div>

          {user && user.userID === singleMovie.iduser &&
          <div>
            <Button
              className='editButton'
              onClick={() => setOpenMovieModal({ open: true, form: 'edit' })}
              size='tiny'>
              EDIT
            </Button>
            <div style={{ height: 10 }}></div>
            <Button
              className='deleteButton'
              onClick={deleteMovie}
              size='tiny'>
              DELETE
            </Button>
          </div>}
        </div>
        
        <div className='information'>
          <div className='title'>{singleMovie.title}</div>
          
          <div className='gray margin'>
            {singleMovie.year === 'no  ' ? 'year unknown' : singleMovie.year}
            <span className='dot'>{'\u2022'}</span>
            {singleMovie.genre}
          </div>

          <div className='ratings' onClick={() => !user ? cannotRate() : canRate()}>
            <Icon name='star' color='yellow' size='large' />
            {ratings.raters === 0
            ?
            'not rated'
            :
            <div>
              {ratings.average} / 10 <span className='raters'>( {ratings.raters} )</span>
            </div>}
          </div>
          
          <div
            className='description'>
            {singleMovie.description === 'no'
            ? 'no description'
            : singleMovie.description}
          </div>

          <div className='row margin'>
            <b className='color'>Director</b>
            <div
              className='gray'>
              {singleMovie.iddirector === 'unknown'
              ? 'unknown'
              : `${singleMovie.director_firstname} ${singleMovie.director_lastname}`}
              </div>
          </div>

          <div className='row'>
            <b className='color'>Cast</b>
            <div className='actorRow'>
              {actors.length > 0
              ?
              actors.map((actor, i) =>
              <div key={i}>{actor.firstname} {actor.lastname}
              {i < actors.length - 1 &&
              <span className='sideMargin'>{'\u2022'}</span>}
              </div>)
              :
              'unknown'
              }
            </div>
          </div>
        </div>
      </div>

      <i className='adder'>Added by {singleMovie.user}</i>

      <RateModal />

    </div>
  )
}

export default Movie