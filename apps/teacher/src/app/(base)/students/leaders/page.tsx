'use client'

import { toast } from 'react-hot-toast'
import styles from './styles.module.css'
import { useState, useTransition, useEffect } from 'react'
import TeacherCard from './_components/teacher-card'
import { BaseSelect } from '@/ui/base-select'
import BaseButton from '@/ui/base-button'
import { BaseInput } from '@/ui/base-input'
import { getAllTeacherWhitelist, addTeacherWhitelist, removeTeacherWhitelist } from './actions'
import { TeacherWhitelist } from '@yurigaoka-app/common'

export default function LeadersPage() {
  const [email, setEmail] = useState<string>('')
  const [role, setRole] = useState<'teacher' | 'manager' | ''>('')
  const [teachers, setTeachers] = useState<TeacherWhitelist[]>([])
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)

  // 先生&寮長一覧を取得
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const fetchedTeachers = await getAllTeacherWhitelist()
        setTeachers(fetchedTeachers)
      } catch (error) {
        console.error('Failed to load teacher whitelist:', error)
        toast.error('先生&寮長の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }
    loadTeachers()
  }, [])

  const handleAddTeacher = () => {
    if (!email.trim()) {
      toast.error('メールアドレスを入力してください')
      return
    }

    if (!role) {
      toast.error('役割を選択してください')
      return
    }

    startTransition(async () => {
      try {
        await addTeacherWhitelist(email.trim(), role as 'teacher' | 'manager')
        toast.success('先生&寮長を追加しました')

        // フォームをリセット
        setEmail('')
        setRole('')

        // 一覧を再取得
        const fetchedTeachers = await getAllTeacherWhitelist()
        setTeachers(fetchedTeachers)
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.error(e)
          toast.error(e.message)
        } else {
          console.error(e)
          toast.error('先生&寮長の追加に失敗しました')
        }
      }
    })
  }

  const handleDeleteTeacher = async (teacherId: string) => {
    try {
      await removeTeacherWhitelist(teacherId)
      toast.success('先生&寮長を削除しました')

      // 一覧を再取得
      const fetchedTeachers = await getAllTeacherWhitelist()
      setTeachers(fetchedTeachers)
    } catch (error) {
      console.error('Failed to delete teacher whitelist:', error)
      toast.error('先生&寮長の削除に失敗しました')
    }
  }

  return (
    <div className={styles.container}>
      {/* 左側 */}
      <div className={styles.leftSection}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAddTeacher()
          }}
          className={styles.form}
        >
          <h1 className={styles.title}>新しい先生&寮長を追加</h1>
          <BaseInput
            label="メールアドレス"
            placeholder="example@ktc.ac.jp"
            value={email}
            onChange={(value) => setEmail(value)}
          />
          <BaseSelect
            label="役割"
            placeholder="役割を選択"
            data={['先生', '寮長']}
            width="100%"
            value={role === 'teacher' ? '先生' : role === 'manager' ? '寮長' : ''}
            onChange={(value: string) => {
              if (value === '先生') {
                setRole('teacher')
              } else if (value === '寮長') {
                setRole('manager')
              } else {
                setRole('')
              }
            }}
          />
          <BaseButton type="submit" idDisabled={!email.trim() || !role || isPending}>
            {isPending ? '追加中...' : '追加する'}
          </BaseButton>
        </form>
      </div>

      {/* 右側 */}
      <div className={styles.rightSection}>
        <h1 className={styles.title}>登録済みの先生&寮長一覧</h1>
        {isLoading ? (
          <div>読み込み中...</div>
        ) : teachers.length === 0 ? (
          <div>登録されている先生&寮長はありません</div>
        ) : (
          <div className={styles.teacherList}>
            {teachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} onDelete={() => handleDeleteTeacher(teacher.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
