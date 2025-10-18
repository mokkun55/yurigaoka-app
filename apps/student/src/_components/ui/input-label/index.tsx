import { Label } from '@/_components/ui/label'
import { cn } from '@/lib/utils'

type Props = {
  label: string
  children: React.ReactNode
  className?: string
}

export default function InputLabel({ label, children, className }: Props) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}
