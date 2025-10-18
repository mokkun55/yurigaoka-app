import { CheckboxField } from './index'

export type MealCheckboxOption = {
  value: string | null
  label: string
  name: string
}

type Props = {
  value: string | null
  onChange: (_value: string | null) => void
  options: MealCheckboxOption[]
  className?: string
}

export function MealCheckboxGroup({ value, onChange, options, className }: Props) {
  return (
    <div className={className ?? 'flex gap-2'}>
      {options.map((opt) => (
        <CheckboxField
          key={opt.name}
          checked={value === opt.value}
          onCheckedChange={(checked) => {
            if (checked) {
              onChange(opt.value)
            } else {
              onChange(null)
            }
          }}
          name={opt.name}
          label={opt.label}
        />
      ))}
    </div>
  )
}
