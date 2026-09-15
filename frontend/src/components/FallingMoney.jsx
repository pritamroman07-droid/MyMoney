import { useMemo } from 'react'

const NOTE_COUNT = 12

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function DollarNote({ index }) {
  const style = useMemo(() => {
    const left = randomBetween(2, 96)
    const duration = randomBetween(8, 16)
    const delay = randomBetween(0, 10)
    const size = randomBetween(24, 40)
    const opacity = randomBetween(0.15, 0.35)

    return {
      left: `${left}%`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      width: `${size}px`,
      height: `${size * 0.45}px`,
      '--note-opacity': opacity,
    }
  }, [])

  return (
    <div className="falling-note" style={style}>
      <svg viewBox="0 0 60 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="0.5" y="0.5" width="59" height="27" rx="3.5" fill="#dcf5e7" stroke="#86efac" strokeWidth="1" />
        <rect x="4" y="4" width="52" height="20" rx="2" fill="none" stroke="#86efac" strokeWidth="0.5" strokeDasharray="2 1" />
        <text x="30" y="17" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#16a34a" fontFamily="system-ui">$</text>
        <circle cx="8" cy="14" r="3" fill="none" stroke="#86efac" strokeWidth="0.5" />
        <circle cx="52" cy="14" r="3" fill="none" stroke="#86efac" strokeWidth="0.5" />
      </svg>
    </div>
  )
}

export default function FallingMoney() {
  const notes = useMemo(() => Array.from({ length: NOTE_COUNT }, (_, i) => i), [])

  return (
    <div className="falling-money-container" aria-hidden="true">
      {notes.map((i) => (
        <DollarNote key={i} index={i} />
      ))}
    </div>
  )
}
