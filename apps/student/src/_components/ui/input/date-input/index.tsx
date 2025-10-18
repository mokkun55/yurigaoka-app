import { BaseInput } from '../base-input'
import { cn } from '@/lib/utils'
import * as React from 'react'

// TODO placeholder問題どうにかする
export function DateInput({ className, id, ...props }: React.ComponentProps<'input'>) {
  const autoId = React.useId()
  return (
    <div className="flex flex-col">
      <BaseInput
        icon="calendar"
        type="date"
        id={id || autoId}
        fullWidth
        className={cn(
          `appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none`,
          className
        )}
        {...props}
      />
    </div>
  )
}
