import { useState, useEffect } from 'react'

function LiveClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date())
    }, 1000)

    // Cleanup: stop the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [])

  return <p className="clock">{now.toLocaleTimeString()}</p>
}

export default LiveClock
