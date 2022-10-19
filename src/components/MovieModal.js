import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../App'
import { v4 as uuid } from 'uuid';
import { Button, Icon, Input, Modal, Select } from 'semantic-ui-react'
import url from '../url'
import '../css/MovieModal.css'

const MovieModal = () => {
  const { user, singleMovie, setSingleMovie, actors, setActors, setRatings, setRated, openMovieModal, setOpenMovieModal, setLoading, setMessage, note } = useContext(AppContext)

  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [imageData, setImageData] = useState(null)
  const [actorFirstname, setActorFirstname] = useState('')
  const [actorLastname, setActorLastname] = useState('')
  const [movieActors, setMovieActors] = useState([])
  const [directorFirstname, setDirectorFirstname] = useState('')
  const [directorLastname, setDirectorLastname] = useState('')
  const [genre, setGenre] = useState('genre unknown')

  useEffect(() => {
    if (openMovieModal.form === 'edit') {
      setTitle(singleMovie.title)
      singleMovie.year !== 'no  ' && setYear(singleMovie.year)
      singleMovie.description !== 'no' && setDescription(singleMovie.description)
      setImage(singleMovie.image)
      setMovieActors(actors)
      singleMovie.iddirector !== 'unknown' && setDirectorFirstname(singleMovie.director_firstname)
      singleMovie.iddirector !== 'unknown' && setDirectorLastname(singleMovie.director_lastname)
      setGenre(singleMovie.genre)
    }
  }, [openMovieModal]) // eslint-disable-line

  const handleImage = (event) => {
    setImageData(event.target.files[0])
    setImage(event.target.files[0].name)
  }

  const addActor = () => {
    if (!actorFirstname || !actorLastname) return
    setMovieActors([...movieActors, { firstname: actorFirstname, lastname: actorLastname }])
    setActorFirstname('')
    setActorLastname('')
  }

  const emptyStates = () => {
    setTitle('')
    setYear('')
    setDescription('')
    setImage(null)
    setImageData(null)
    setActorFirstname('')
    setActorLastname('')
    setMovieActors([])
    setDirectorFirstname('')
    setDirectorLastname('')
    setGenre('genre unknown')
  }

  const chooseGenre = (chosenGenre) => {
    switch(chosenGenre) {
      case 'Action':
        return 2
      case 'Adventure':
        return 3
      case 'Comedy':
        return 4
      case 'Drama':
        return 5
      case 'Fantasy':
        return 6
      case 'Horror':
        return 7
      case 'Mystery':
        return 8
      case 'Science':
        return 9
      case 'Other':
        return 1
      default:
        return 1
    }
  }

  const saveMovie = async () => {
    if (!title) return

    setLoading(true)
    setOpenMovieModal({ open: false })

    let movieID = null

    openMovieModal.form === 'new'
    ? movieID = `ID${uuid()}`
    : movieID = singleMovie.idmovie

    let directorID = 'unknown'

    if (directorFirstname && directorLastname) {
      const newID = `ID${uuid()}`

      const response = await fetch(`${url}/director`, {
        method: 'POST',
        headers: { 'content-type' : 'application/json' },
        body: JSON.stringify({
          iddirector: newID,
          firstname: directorFirstname,
          lastname: directorLastname
        })
      })

      directorID = await response.text()
    }

    let method = null

    openMovieModal.form === 'new'
    ? method = 'POST'
    : method = 'PUT'

    const movie = await fetch(`${url}/movie`, {
      method: method,
      headers: { 'content-type' : 'application/json' },
      body: JSON.stringify({
        idmovie: movieID,
        title: title,
        year: year ? year : 'no',
        description: description ? description : 'no',
        image: image ? image : 'no',
        iddirector: directorID,
        idgenre: chooseGenre(genre),
        iduser: user.userID,
        user: '',
        director_firstname: '',
        director_lastname: '',
        genre: ''
      })
    })

    if (await movie.text() === 'A movie with that title already exists') {
      setMessage('A movie with that title already exists')
      note.current.style.display = 'flex'
      setLoading(false)
      setTimeout(() => {
        note.current.style.display = 'none'
      }, 3000)
      return
    }

    if (imageData) {
      const data = new FormData()
      data.append('image', imageData)

      await fetch(`${url}/upload`, {
        method: 'POST',
        body: data
      })
    }

    if (movieActors.length > 0) {
      for (const actor of movieActors) {
        let actorID = `ID${uuid()}`

        const response = await fetch(`${url}/actor`, {
          method: 'POST',
          headers: { 'content-type' : 'application/json' },
          body: JSON.stringify({
            idactor: actorID,
            firstname: actor.firstname,
            lastname: actor.lastname
          })
        })

        actorID = await response.text()

        await fetch(`${url}/movieactor`, {
          method: 'POST',
          headers: { 'content-type' : 'application/json' },
          body: JSON.stringify({
            idmovie: movieID,
            idactor: actorID
          })
        })
      }
    }

    emptyStates()

    const getMovie = await fetch(`${url}/movie/${movieID}`)
    setSingleMovie(await getMovie.json())

    const getActors = await fetch(`${url}/actor?id=${movieID}`)
    setActors(await getActors.json())

    const getRatings = await fetch(`${url}/rating?id=${movieID}`)
    setRatings(await getRatings.json())

    if (openMovieModal.form === 'new') setRated(false)

    const removedGaps = title.replaceAll(' ', '')

    navigate(`/movie/${removedGaps}`)

    setLoading(false)
  }

  const genreOptions = [
    {value: 'Action', text: 'Action'},
    {value: 'Adventure', text: 'Adventure'},
    {value: 'Comedy', text: 'Comedy'},
    {value: 'Drama', text: 'Drama'},
    {value: 'Fantasy', text: 'Fantasy'},
    {value: 'Horror', text: 'Horror'},
    {value: 'Mystery', text: 'Mystery'},
    {value: 'Science', text: 'Science'},
    {value: 'Other', text: 'Other'}
  ]

  return (
    <Modal open={openMovieModal.open}>
      <div className='moviemodal'>

        <Icon
          name='x'
          className='closemodal'
          onClick={() => {
            setOpenMovieModal({ open: false })
            emptyStates()
            }
          }
        />

        <div className='movierow'>
          <div className='column1'>
            <b className='head'>TITLE</b>
            <Input
              className='marginBottom'
              autoFocus={openMovieModal.form === 'new' && true}
              placeholder='Title'
              onChange={(event) =>
                openMovieModal.form === 'new' &&
                setTitle(event.target.value)}
              value={title}
              maxLength={100}
              size='big'
            />
          </div>
          
          <div className='column2'>
            <b className='head'>YEAR</b>
            <Input
              className='marginBottom'
              placeholder='Year'
              onChange={(event) => setYear(event.target.value)}
              value={year}
              maxLength={4}
              size='big'
            />
          </div>
        </div>

        <div className='column3'>
          <b className='head'>DESCRIPTION</b>
          <Input 
            className='marginBottom'
            placeholder='Description'
            onChange={(event) => setDescription(event.target.value)}
            value={description}
            maxLength={255}
            size='big'
          />
        </div>

        <div className='movierow'>
          <div className='column4'>
            <b className='head'>DIRECTOR</b>
            <Input
              className='marginBottom'
              placeholder="Director's firstname"
              onChange={(event) => setDirectorFirstname(event.target.value)}
              value={directorFirstname}
              maxLength={45}
            />
          </div>
        
          <div className='column5'>
            <b className='hidden'>HIDDEN TEXT</b>
            <Input
              className='marginBottom'
              placeholder="Director's lastname"
              onChange={(event) => setDirectorLastname(event.target.value)}
              value={directorLastname}
              maxLength={45}
            />
          </div>
        
          <div className='column6'>
            <b className='head'>GENRE</b>
            <Select
              placeholder={genre === 'genre unknown' ? 'Select genre' : genre}
              options={genreOptions}
              onChange={(event) => setGenre(event.target.textContent)}>
            </Select>
          </div>
        </div>

        <div className='movierow'>
          <div className='column4'>
            <b className='head'>ACTORS</b>
            <Input
              className='marginBottom'
              placeholder="Actor's firstname"
              onChange={(event) => setActorFirstname(event.target.value)}
              value={actorFirstname}
              maxLength={45}
            />
          </div>
        
          <div className='column7'>
            <b className='hidden'>HIDDEN TEXT</b>
            <Input
              className='marginBottom'
              placeholder="Actor's lastname"
              onChange={(event) => setActorLastname(event.target.value)}
              value={actorLastname}
              maxLength={45}
            />
          </div>

          <div className='column8'>
            <b className='hidden'>HIDDEN TEXT</b>
            <label className='ui button' onClick={addActor}
              style={{ width: '100%' }}>
              <i className='ui plus icon'></i> 
              Add actor
            </label>
          </div>
        </div>

        <div className='actors'>
          {movieActors.map((actor, i) =>
          <div
            key={i}
            className='actorBlock'>
            {actor.firstname} {actor.lastname}
            <span
              onClick={() =>
              setMovieActors(movieActors.filter((_actor, index) => index !== i))}
              className='xIcon'>
              <Icon name='x' />
            </span>
          </div>)}
        </div>
        
        <div className='movierow'>
          <div className='saveButton'>
            <Button
              onClick={saveMovie}
              style={{
                width: '100%',
                background: 'rgb(0, 180, 150)',
                color: 'white'
              }}>SAVE
            </Button>
          </div>

          <input
            style={{ display: 'none' }}
            type='file'
            accept='image/*'
            id='moviecover'
            onChange={handleImage}>
          </input>

          <div className='label'>
            <label htmlFor='moviecover' className='ui button'
              style={{ width: '100%' }}>
              <i className='ui upload icon'></i> 
              Upload image
            </label>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default MovieModal