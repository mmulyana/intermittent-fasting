import React from 'react'
import { formatTime } from '../utils'
import Flame from '/flame.png'

export default function CircularProgress({
  percentage,
  size = 200,
  strokeWidth = 20,
  color = '#6366f1',
  time,
  isRunning,
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // Calculate icon position
  const angle = (percentage / 100) * 2 * Math.PI - Math.PI / 2
  const iconX = size / 2 + radius * Math.cos(angle)
  const iconY = size / 2 + radius * Math.sin(angle)

  return (
    <div className='relative' style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className='text-[#494949]'
          strokeWidth={strokeWidth}
          stroke='currentColor'
          fill='transparent'
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className='text-blue-600'
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap='round'
          stroke={color}
          fill='transparent'
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {!!isRunning && (
        <div className='absolute inset-0 flex items-center justify-center flex-col gap-2'>
          <span className='text-sm font-bold text-white'>{Math.round(percentage)}%</span>
          <p className='text-white font-semibold bg-white/10 px-3 py-1 rounded-full text-lg'>{formatTime(time)}</p>
        </div>
      )}
      <div
        className='absolute h-9 w-9 rounded-full bg-[#b3b2b2] flex items-center justify-center'
        style={{
          left: `${iconX}px`,
          top: `${iconY}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <img src={Flame} className='w-8 h-8'/>
      </div>
    </div>
  )
}
