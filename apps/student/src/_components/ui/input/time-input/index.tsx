import { BaseInput } from '../base-input'
import { cn } from '@/lib/utils'

export function TimeInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <div className="flex flex-col">
      <BaseInput
        icon="clock"
        type="time"
        id="time-picker"
        step="600"
        className={cn(
          'appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none',
          className
        )}
        {...props}
      />
    </div>
  )
}
