import React from 'react'
import Lottie from 'react-lottie'

import './styles.css'

interface FeedbackProps {
  animation: object
  text: string
}

const Feedback: React.FC<FeedbackProps> = ({ animation, text }) => {

  return (
    <div className="overlay">
      <Lottie 
        options={{autoplay: true, animationData: animation}}
        height={300}
        width={300} />
      <span>{text}</span>
    </div>
  )
}

export default Feedback