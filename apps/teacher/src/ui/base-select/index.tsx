import { Select } from '@mantine/core'

type Props = {
  label: string
  value: string
  onChange: (_value: string) => void
  placeholder?: string
  data: string[]
  width?: string
  clearable?: boolean
}

export const BaseSelect = ({ label, value, onChange, placeholder, data, width, clearable = true, ...props }: Props) => {
  return (
    <Select
      label={label}
      placeholder={placeholder}
      data={data}
      style={{ width }}
      value={value}
      onChange={(newValue) => onChange(newValue ?? '')}
      clearable={clearable}
      allowDeselect={false}
      {...props}
    />
  )
}
