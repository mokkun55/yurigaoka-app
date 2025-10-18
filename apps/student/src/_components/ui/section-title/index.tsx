import { cn } from '@/lib/utils'

type Props = {
  title: string
  isMargin?: boolean
  className?: string
}

export default function SectionTitle({ title, isMargin = true, className }: Props) {
  return (
    <p className={cn('text-sm font-bold border-b border-(--border-gray) pb-1', isMargin && 'mt-4 mb-2', className)}>
      {title}
    </p>
  )
}
