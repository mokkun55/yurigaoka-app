import styles from './styles.module.css'

type Props = {
  value: string
  onChange: (_value: string) => void
  placeholder?: string
  label?: string
}

export default function BaseTextarea({ value, onChange, placeholder, label }: Props) {
  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
      />
    </div>
  )
}
