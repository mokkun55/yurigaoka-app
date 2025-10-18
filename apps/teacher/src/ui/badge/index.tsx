import clsx from 'clsx'
import styles from './styles.module.css'

type Props = {
  variant: 'pending' | 'approved' | 'rejected' | 'canceled' | 'stay' | 'leave'
  size?: 'small' | 'big'
}

const variantMap = {
  pending: '申請中',
  approved: '承認済',
  rejected: '却下',
  canceled: 'キャンセル',
  stay: '在寮',
  leave: '帰省',
}

export default function Badge({ variant, size = 'small' }: Props) {
  return <div className={clsx(styles.badge, styles[variant], styles[size])}>{variantMap[variant]}</div>
}
