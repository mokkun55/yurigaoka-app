import { Input as MantineInput } from '@mantine/core'

type Props = {
  value: string
  onChange: (_value: string) => void
  placeholder?: string
  label?: string
}

export const BaseInput = ({ label, value, onChange, placeholder }: Props) => {
  if (label) {
    return (
      <MantineInput.Wrapper label={label}>
        <Input value={value} onChange={onChange} placeholder={placeholder} />
      </MantineInput.Wrapper>
    )
  }
  return <Input value={value} onChange={onChange} placeholder={placeholder} />
}

const Input = ({ value, onChange, placeholder }: Props) => {
  return <MantineInput value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
}
