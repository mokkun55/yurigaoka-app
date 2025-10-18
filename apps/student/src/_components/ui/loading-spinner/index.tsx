import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

type Props = {
  size?: number
  className?: string
}

export default function LoadingSpinner({ className, size = 24 }: Props) {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className={cn('animate-spin text-(--main-blue)', className)} size={size} />
    </div>
  )
}
