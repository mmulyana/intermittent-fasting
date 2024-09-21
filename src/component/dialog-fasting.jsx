import { X } from 'lucide-react'

const options = [
  {
    name: '14:10',
    value: 14,
  },
  {
    name: '16:8',
    value: 16,
  },
  {
    name: '18:6',
    value: 18,
  },
  {
    name: '20:4',
    value: 20,
  },
]

export default function DialogFasting({ open, setOpen, setHour }) {
  const onClickProgram = (value) => {
    setHour(value)
    setOpen(false)
  }

  if (!open) return null
  return (
    <div className='absolute top-0 left-0 w-full h-screen py-5 px-6 bg-[#343333]'>
      <button className='absolute top-5 right-5 z-10' onClick={() => setOpen(false)}>
        <X className='w-5 h-5 text-white/80' />
      </button>
      <p className='text-center font-medium text-white'>Choose Program</p>
      <div className='mt-6 space-y-5'>
        {options.map((option, index) => (
          <div
            key={index}
            className='bg-[#494949] rounded pt-2 px-3 pb-3 border border-transparent hover:border-blue-600 cursor-pointer'
            onClick={() => onClickProgram(option.value)}
          >
            <p className='text-lg text-white font-medium'>{option.name}</p>

            <ul className='space-y-2 mt-2 text-sm'>
              <li className='flex items-center gap-1.5 text-white'>
                <div className='w-1.5 h-1.5 rounded-full bg-white/20'></div>
                {option.value} hours fasting
              </li>
              <li className='flex items-center gap-1.5 text-white'>
                <div className='w-1.5 h-1.5 rounded-full bg-white/20'></div>
                {24 - option.value} hours eating
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
