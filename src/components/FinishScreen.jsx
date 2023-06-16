import React from 'react'

function FinishScreen({ points, maxPossiblePoints, highScore, dispatch }) {
  const percentage = (points/maxPossiblePoints) * 100
  
  return (
    <>
      <p className='result'>
        🏅 You scored
        <strong> {points} </strong>out of {maxPossiblePoints} ({Math.ceil(percentage)}%)
      </p>
      <p className='highscore'>(Highscore: {highScore})</p>
      <button
				className='btn btn-ui'
				onClick={() => dispatch({type: 'restart'})}
			>
				Let's start
			</button>
    </>
  )
}

export default FinishScreen