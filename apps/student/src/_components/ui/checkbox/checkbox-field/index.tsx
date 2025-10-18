import { Label } from '../../label'
import { Checkbox } from '../ui/base-checkbox'
import * as React from 'react'

type Props = {
  label: string
  checked?: boolean
  onCheckedChange?: (_checked: boolean) => void
  name?: string
  disabled?: boolean
  inputRef?: React.Ref<HTMLButtonElement>
}

export const CheckboxField = React.forwardRef<HTMLButtonElement, Props>(
  ({ label, checked, onCheckedChange, name, disabled, inputRef }, ref) => {
    return (
      <div className="flex items-center gap-2 border border-(--border-gray) rounded-md p-2 w-full">
        <Label className="w-full">
          <Checkbox
            className="border-black border-[2px] rounded-sm w-5 h-5"
            checked={checked}
            onCheckedChange={(value) => onCheckedChange?.(value === true)}
            name={name}
            disabled={disabled}
            ref={inputRef || ref}
          />
          <span className="text-black">{label}</span>
        </Label>
      </div>
    )
  }
)
CheckboxField.displayName = 'CheckboxField'
