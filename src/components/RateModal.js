import { useContext, useEffect, useRef } from 'react'
import { AppContext } from '../App'
import { v4 as uuid } from 'uuid';
import { Button, Icon, Modal } from 'semantic-ui-react'
import url from '../url'
import '../css/Rate.css'

let chosen = false

const RateModal = () => {
  const { user, singleMovie, ratings, setRatings, setRated, openRateForm, setOpenRateForm } = useContext(AppContext)

  const refs = useRef([])

  const stars = []
  
  for (let i = 0; i < 10; i++) {
    stars.push(<Icon name='star' size='big' className='star' />)
  }

  const handleStars = (number) => {
    if (chosen) return

    let lowestNumber = number - 9
    if (lowestNumber < 0) lowestNumber = 0

    for (let i = lowestNumber; i < number + 1; i++) {
      refs.current[i].classList.add('gold')
    }

    let highestNumber = number + 10
    if (highestNumber > 10) highestNumber = 10

    for (let i = number + 1; i < highestNumber; i++) {
      refs.current[i].classList.remove('gold')
    }
  }

  const chooseStar = () => {
    chosen === false
    ? chosen = true
    : chosen = false
  }

  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      if (refs.current[i]) {
        refs.current[i].addEventListener('mouseover', () => handleStars(i))
      }
    }
  }, [openRateForm]) // eslint-disable-line

  const rate = async () => {
    let points = 0

    for (let i = 0; i < 10; i++) {
      if (refs.current[i].classList.contains('gold')) {
        points = i + 1
      }
    }

    const id = uuid()

    await fetch(`${url}/rating`, {
      method: 'POST',
      headers: { 'content-type' : 'application/json' },
      body: JSON.stringify({
        idrating: `ID${id}`,
        rating: points,
        iduser: user.userID
      })
    })

    await fetch(`${url}/movierating`, {
      method: 'POST',
      headers: { 'content-type' : 'application/json' },
      body: JSON.stringify({
        idmovie: singleMovie.idmovie,
        idrating: `ID${id}`
      })
    })

    let average = (ratings.sum + points) / (ratings.raters + 1)

    if (String(average).length > 1) {
      average = average.toFixed(1)
    }

    setRatings({
      average: average,
      raters: ratings.raters + 1
    })

    chosen = false
    setRated(true)
    setOpenRateForm(false)
  }

  return (
    <Modal open={openRateForm}
      style={{ width: 'max-content', background: 'rgb(224, 225, 226)' }}>
      
      <Icon
        className='closeicon'
        name='x'
        onClick={() => {
          setOpenRateForm(false)
          chosen = false
        }}
      />
      
      <div className='rate'>
        <div className='ratechild'>
          <div className='stars'>
            {stars.map((star, i) =>
            <div
              key={i}
              ref={element => refs.current[i] = element}
              onClick={chooseStar}>
              {star}
            </div>)}
          </div>
        
          <div className='rateButton'>
            <Button
              onClick={rate}
              style={{
                background: 'rgb(0, 180, 150)',
                color: 'white'
              }}>RATE
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default RateModal