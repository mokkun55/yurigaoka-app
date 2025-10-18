'use client'

import { X, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  title: string
  type?: 'back' | 'close' | 'none'
  customUrl?: string
  onClick?: () => void
}

export default function Header({ title, type = 'none', customUrl, onClick }: Props) {
  const router = useRouter()

  return (
    <div className="flex items-center bg-white min-h-14 border-b border-(--border-gray) sticky top-0">
      {type !== 'none' && (
        <button
          className="p-4 cursor-pointer"
          onClick={() => {
            if (onClick) return onClick()
            if (type === 'back') {
              router.back()
            } else {
              router.push(customUrl ?? '/')
            }
          }}
        >
          {type === 'back' && <ChevronLeft size={24} />}
          {type === 'close' && <X size={24} />}
        </button>
      )}
      <h1 className="absolute left-1/2 -translate-x-1/2">{title}</h1>
    </div>
  )
}
