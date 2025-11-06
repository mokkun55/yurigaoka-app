import styles from './styles.module.css'
import dayjs from '@/libs/dayjs'
import { Copy, Trash } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useDisclosure } from '@mantine/hooks'
import BaseModal from '@/ui/base-modal'
import BaseButton from '@/ui/base-button'

type Props = {
  code: string
  usageCount: number
  limitDate: Date
  onDelete: () => Promise<void>
}

export default function CodeCard({ code, usageCount, limitDate, onDelete }: Props) {
  const [modalOpened, { open: modalOpen, close: modalClose }] = useDisclosure(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    toast.success('コードをコピーしました')
  }

  const handleDelete = async () => {
    try {
      await onDelete()
      modalClose()
    } catch (e) {
      console.error(e)
      toast.error('コード「' + code + '」を削除できませんでした')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.codeContainer}>
        <p className={styles.code}>{code}</p>
        <div className={styles.bottom}>
          <p className={styles.limitDate}>{dayjs(limitDate).format('YYYY/MM/DD')} 23:59</p>
          <p className={styles.usageCount}>使用回数: {usageCount}回</p>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleCopy}>
          <Copy size={24} color="var(--sub-text)" />
        </button>
        <button className={styles.button} onClick={modalOpen}>
          <Trash size={24} color="var(--red)" />
        </button>
      </div>

      {/* モーダル */}
      <BaseModal opened={modalOpened} onClose={modalClose}>
        <div className={styles.modalContent}>
          <h1 className={styles.modalTitle}>この招待コードを削除しますか?</h1>
          <p className={styles.modalDescription}>この操作は取り消すことができません。</p>
          <div className={styles.modalButtons}>
            <BaseButton variant="danger" onClick={handleDelete} width="180px">
              削除する
            </BaseButton>
            <BaseButton variant="secondary" onClick={modalClose} width="180px">
              キャンセル
            </BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  )
}
