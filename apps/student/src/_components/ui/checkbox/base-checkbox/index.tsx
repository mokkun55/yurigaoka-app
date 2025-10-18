import React from 'react'
import { Checkbox } from '../ui/base-checkbox'
import { Label } from '@/_components/ui/label'
import { cn } from '@/lib/utils'

type Props = {
  label?: string
  className?: string // for wrapper div
} & React.ComponentProps<typeof Checkbox>

export const BaseCheckbox = ({ label, className, ...props }: Props) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Label>
        <Checkbox {...props} />
        <span>{label}</span>
      </Label>
    </div>
  )
}
