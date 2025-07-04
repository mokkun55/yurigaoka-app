'use client'

import { X, ChevronLeft } from 'lucide-react'

type Props = {
  title: string
  type?: 'back' | 'close' | 'none'
  onClick?: () => void
}

export default function Header({ title, type = 'none', onClick }: Props) {
  return (
    <div className="flex items-center bg-white h-12 border-b border-(--border-gray) relative">
      {type !== 'none' && (
        <button className="p-4 cursor-pointer" onClick={onClick}>
          {type === 'back' && <ChevronLeft size={24} />}
          {type === 'close' && <X size={24} />}
        </button>
      )}
      <h1 className="absolute left-1/2 -translate-x-1/2">{title}</h1>
    </div>
  )
}
