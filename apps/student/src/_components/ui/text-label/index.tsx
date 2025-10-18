import { cn } from '@/lib/utils'

type Props = {
  label: string
  className?: string
}

export default function TextLabel({ label, className }: Props) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p className="text-(--sub-text)">{label}</p>
    </div>
  )
}
