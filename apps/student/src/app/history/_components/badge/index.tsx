import { cn } from '@/lib/utils'

type Props = {
  type: 'pending' | 'approved' | 'rejected' | 'canceled'
  size: 'small' | 'big'
  className?: string
}

export default function Badge({ type, size, className }: Props) {
  let text = ''
  let color = ''
  let sizeClass = ''

  switch (type) {
    case 'pending':
      text = '申請中'
      color = 'bg-(--badge-pending-background) text-(--badge-pending-text)'
      break
    case 'approved':
      text = '承認済み'
      color = 'bg-(--badge-approved-background) text-(--badge-approved-text)'
      break
    case 'rejected':
      text = '却下'
      color = 'bg-(--badge-rejected-background) text-(--badge-rejected-text)'
      break
    case 'canceled':
      text = 'キャンセル'
      color = 'bg-(--badge-canceled-background) text-(--badge-canceled-text)'
      break
  }

  switch (size) {
    case 'big':
      sizeClass = 'px-[32px] py-[8px] text-sm'
      break
    case 'small':
      sizeClass = 'px-[8px] py-[2px] text-xs'
      break
  }

  return <div className={cn(color, sizeClass, 'font-bold w-fit rounded-full', className)}>{text}</div>
}
