import React from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from './ui/select'
import { cn } from '@/lib/utils'

type Option = {
  label: string
  value: string
  fullWidth?: boolean
}

export type BaseSelectProps = {
  options: Option[]
  placeholder?: string
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void
  value?: string
  name?: string
  onBlur?: () => void
  disabled?: boolean
  className?: string
  fullWidth?: boolean
}

export const BaseSelect = React.forwardRef<React.ElementRef<typeof SelectTrigger>, BaseSelectProps>(
  ({ options, placeholder, disabled, className, fullWidth, ...props }, ref) => {
    return (
      <Select onValueChange={props.onChange} value={props.value} name={props.name} disabled={disabled}>
        <SelectTrigger ref={ref} className={cn({ 'w-full': fullWidth }, className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
)

BaseSelect.displayName = 'BaseSelect'
