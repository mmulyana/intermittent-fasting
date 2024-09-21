import { useEffect, useState } from 'react'
import { formatTime } from '../utils'
import { format, parseISO, differenceInSeconds } from 'date-fns'
import { Trash } from 'lucide-react'
import { STORAGE_ACTIVITY } from '../consts/localstorage'

export default function Activity() {
  const [loggedTimers, setLoggedTimers] = useState([])

  useEffect(() => {
    const storedLoggedTimers = localStorage.getItem(STORAGE_ACTIVITY)
    if (storedLoggedTimers) {
      setLoggedTimers(JSON.parse(storedLoggedTimers))
    }
  }, [])

  const parseCustomDateString = (dateString) => {
    return new Date(dateString)
  }

  const calculateTotalTime = (timeElapsed, overTime) => {
    return timeElapsed + overTime
  }

  const handleDelete = (index) => {
    const updatedTimers = loggedTimers.filter((_, i) => i !== index)
    setLoggedTimers(updatedTimers)
    localStorage.setItem(STORAGE_ACTIVITY, JSON.stringify(updatedTimers))
  }

  return (
    <div className='mt-4 px-6'>
      <h3 className='mb-4 text-white'>My Activity</h3>
      <div className='space-y-3'>
        {loggedTimers.map((timer, index) => {
          const startDateTime = parseCustomDateString(timer.startTime)
          const actualEndDateTime = parseCustomDateString(timer.actualEndTime)
          const totalTime = calculateTotalTime(
            timer.timeElapsed,
            timer.overTime
          )

          return (
            <div
              key={index}
              className='bg-[#494949] rounded-lg py-3 px-4 text-white shadow-md'
            >
              <div className='flex justify-end'>
                <button onClick={() => handleDelete(index)}>
                  <Trash className='w-4 h-4 text-red-400' />
                </button>
              </div>
              <div className='space-y-1.5 mt-4'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm opacity-70'>Start time</p>
                  <p className='text-sm'>
                    {format(startDateTime, 'MMM dd hh:mm a')}
                  </p>
                </div>
                <div className='flex items-center justify-between'>
                  <p className='text-sm opacity-70'>End time</p>
                  <p className='text-sm'>
                    {format(actualEndDateTime, 'MMM dd hh:mm a')}
                  </p>
                </div>
                <div className='flex items-center justify-between'>
                  <p className='text-sm opacity-70'>Total time</p>
                  <p className='text-sm'>{formatTime(totalTime)}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
