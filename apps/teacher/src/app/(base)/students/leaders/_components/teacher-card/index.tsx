import styles from './styles.module.css'
import dayjs from '@/libs/dayjs'
import { Trash } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useDisclosure } from '@mantine/hooks'
import BaseModal from '@/ui/base-modal'
import BaseButton from '@/ui/base-button'
import { TeacherWhitelist } from '@yurigaoka-app/common'

type Props = {
  teacher: TeacherWhitelist
  onDelete: () => Promise<void>
}

export default function TeacherCard({ teacher, onDelete }: Props) {
  const [modalOpened, { open: modalOpen, close: modalClose }] = useDisclosure(false)

  const handleDelete = async () => {
    try {
      await onDelete()
      modalClose()
    } catch (e) {
      console.error(e)
      toast.error('削除に失敗しました')
    }
  }

  const roleLabel = teacher.role === 'teacher' ? '先生' : '寮長'

  return (
    <div className={styles.container}>
      <div className={styles.teacherContainer}>
        <div className={styles.top}>
          <p className={styles.email}>{teacher.email}</p>
          <span className={styles.role}>{roleLabel}</span>
        </div>
        <p className={styles.createdAt}>登録日: {dayjs(teacher.createdAt).format('YYYY年MM月DD日')}</p>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={modalOpen}>
          <Trash size={24} color="var(--red)" />
        </button>
      </div>

      {/* モーダル */}
      <BaseModal opened={modalOpened} onClose={modalClose}>
        <div className={styles.modalContent}>
          <h1 className={styles.modalTitle}>この{roleLabel}を削除しますか?</h1>
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
