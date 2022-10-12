/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import '../css/Image.css'

import movie1 from '../images/movie1.png'
import movie2 from '../images/movie2.png'
import movie3 from '../images/movie3.png'
import movie4 from '../images/movie4.png'
import movie5 from '../images/movie5.png'
import movie6 from '../images/movie6.png'
import movie7 from '../images/movie7.png'
import movie8 from '../images/movie8.png'

const Main = () => {
  const [fader, setFader] = useState(null)
  const [opacity, setOpacity] = useState(9)
  const [blur, setBlur] = useState(0)
  const [imageNumber, setImageNumber] = useState(0)
  const [fadingOut, setFadingOut] = useState(true)
  
  const image = useRef()

  const images = [movie1, movie2, movie3, movie4, movie5, movie6, movie7, movie8]

  const fadeOut = () => {
    setFader(setInterval(() => {
      setOpacity(opacity => opacity - 1)
      setBlur(blur => blur + 0.5)
    }, 150))
  }

  const fadeIn = () => {
    setFader(setInterval(() => {
      setOpacity(opacity => opacity + 1)
      setBlur(blur => blur - 0.5)
    }, 150))

    setFadingOut(false)
  }

  useLayoutEffect(() => {
    setTimeout(fadeOut, 3000)
  }, [])

  useEffect(() => {
    image.current.style.opacity = `0.${opacity}`
    image.current.style.filter = `blur(${blur}px)`
    
    if (opacity === 0) {
      clearInterval(fader)
      setImageNumber(number => number + 1)
      fadeIn()
    }

    if (opacity === 9 && !fadingOut) {
      clearInterval(fader)
      setTimeout(fadeOut, 3000)
    }
  }, [opacity])

  useEffect(() => {
    let number = imageNumber
    
    if (number === 8) {
      number = 0
      setImageNumber(0)
    }

    image.current.style.backgroundImage = `url(${images[number]})`
  }, [imageNumber])

  return <div ref={image} className='image'></div>
}

export default Main