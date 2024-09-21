import React, { useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import DialogFasting from './dialog-fasting'
import CircularProgress from './circular'
import { format, addHours, differenceInSeconds, parseISO, set } from 'date-fns'
import {
  STORAGE_ACTIVITY,
  STORAGE_END,
  STORAGE_START,
} from '../consts/localstorage'

export default function Timer() {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [startDateTime, setStartDateTime] = useState('')
  const [endDateTime, setEndDateTime] = useState('')
  const [loggedTimers, setLoggedTimers] = useState([])
  const [overTime, setOverTime] = useState(0)
  const [percentage, setPercentage] = useState(0)
  const [openFasting, setOpenFasting] = useState(false)
  const [fastHour, setFastHour] = useState(14)
  const [openStart, setOpenStart] = useState(false)

  useEffect(() => {
    const localStartTime = localStorage.getItem(STORAGE_START)
    const localEndTime = localStorage.getItem(STORAGE_END)
    const localActivity = localStorage.getItem(STORAGE_ACTIVITY)

    if (localStartTime && localEndTime) {
      setStartDateTime(localStartTime)
      setEndDateTime(localEndTime)
      setIsRunning(true)
    }

    if (localActivity) {
      setLoggedTimers(JSON.parse(localActivity))
    }
  }, [])

  useEffect(() => {
    let intervalId

    if (isRunning) {
      intervalId = setInterval(() => {
        const now = new Date()
        const start = parseISO(startDateTime)
        const end = parseISO(endDateTime)
        const totalDuration = differenceInSeconds(end, start)
        const elapsed = differenceInSeconds(now, start)

        if (now < start) {
          setTimeElapsed(0)
          setOverTime(0)
          setPercentage(0)
        } else if (now >= start && now < end) {
          setTimeElapsed(elapsed)
          setOverTime(0)
          setPercentage(Math.round((elapsed / totalDuration) * 100))
        } else {
          setTimeElapsed(totalDuration)
          setOverTime(differenceInSeconds(now, end))
          setPercentage(100)
        }
      }, 1000)
    }

    return () => clearInterval(intervalId)
  }, [isRunning, startDateTime, endDateTime])

  const calculateEndDateTime = (start) => {
    const startDate = parseISO(start)
    const endDate = addHours(startDate, fastHour)
    return format(endDate, "yyyy-MM-dd'T'HH:mm")
  }

  const handleStartDateTimeChange = (e) => {
    const inputTime = e.target.value
    const [hours, minutes] = inputTime.split(':').map(Number)
    const now = new Date()
    const newStartDateTime = set(now, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0,
    })
    const formattedStartDateTime = format(
      newStartDateTime,
      "yyyy-MM-dd'T'HH:mm"
    )

    setStartDateTime(formattedStartDateTime)
    setEndDateTime(calculateEndDateTime(formattedStartDateTime))
    setOpenStart(false)
  }

  const handleStartTimer = () => {
    const now = new Date()
    const newStartDateTime = startDateTime || format(now, "yyyy-MM-dd'T'HH:mm")
    const newEndDateTime = calculateEndDateTime(newStartDateTime)

    setStartDateTime(newStartDateTime)
    setEndDateTime(newEndDateTime)
    localStorage.setItem(STORAGE_START, newStartDateTime)
    localStorage.setItem(STORAGE_END, newEndDateTime)
    setIsRunning(true)
  }

  const handleEndTimer = () => {
    setIsRunning(false)
    localStorage.removeItem(STORAGE_START)
    localStorage.removeItem(STORAGE_END)

    const timerData = {
      startTime: format(parseISO(startDateTime), 'PPpp'),
      endTime: format(parseISO(endDateTime), 'PPpp'),
      actualEndTime: format(new Date(), 'PPpp'),
      timeElapsed,
      overTime,
    }

    const updatedLoggedTimers = [...loggedTimers, timerData]
    setLoggedTimers(updatedLoggedTimers)
    localStorage.setItem(STORAGE_ACTIVITY, JSON.stringify(updatedLoggedTimers))
  }

  return (
    <>
      <div className='py-5 px-4 rounded-lg flex flex-col items-center'>
        <div className='flex justify-end w-full mb-2'>
          <button
            className='bg-[#494949] pl-4 pr-2.5 py-1.5 rounded-full font-medium text-white flex items-center gap-2'
            onClick={() => setOpenFasting(true)}
          >
            {fastHour}:{24 - fastHour}
            <Pencil className='w-4 h-4 opacity-50' />
          </button>
        </div>

        <CircularProgress
          time={overTime > 0 ? overTime : timeElapsed}
          isRunning={isRunning}
          percentage={isRunning ? percentage : 0}
        />

        <div className='mb-4 grid grid-cols-2 w-full mt-4'>
          <div className='flex flex-col justify-center items-center relative'>
            <span
              className='text-gray-300 text-sm font-medium mb-1 flex gap-2 items-center cursor-pointer hover:bg-gray-50/20 px-2.5 py-1.5 rounded'
              onClick={() => setOpenStart(!openStart)}
            >
              Started
              <Pencil className='w-4 h-4' />
            </span>
            {openStart || !startDateTime ? (
              <input
                type='time'
                value={
                  startDateTime ? format(parseISO(startDateTime), 'HH:mm') : ''
                }
                onChange={handleStartDateTimeChange}
                className='w-fit ml-2 p-1 text-white rounded border border-none bg-[#494949]'
              />
            ) : (
              <p className='text-white'>
                {format(
                  parseISO(startDateTime) || new Date(),
                  'MMM dd hh:mm a'
                )}
              </p>
            )}
          </div>

          <div className='flex flex-col justify-center items-center'>
            <span className='text-gray-300 text-sm font-medium mb-1'>End</span>

            <p
              className={[
                'text-center',
                !endDateTime ? 'text-transparent' : 'text-white',
              ].join(' ')}
            >
              {endDateTime
                ? format(parseISO(endDateTime) || new Date(), 'MMM dd hh:mm a')
                : '-'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (isRunning) {
              handleEndTimer()
            } else {
              handleStartTimer()
            }
          }}
          className='bg-[#6967F1] text-white px-4 py-2 hover:bg-blue-600 rounded-full mt-2 text-sm font-medium'
        >
          {!isRunning ? 'Start Fasting' : 'End Fasting'}
        </button>
      </div>
      <DialogFasting
        open={openFasting}
        setOpen={setOpenFasting}
        setHour={setFastHour}
      />
    </>
  )
}
