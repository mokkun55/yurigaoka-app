'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import InputLabel from '@/_components/ui/input-label'
import { BaseInput } from '@/_components/ui/input/base-input'
import { BaseSelect } from '@/_components/ui/input/base-select'
import SectionTitle from '@/_components/ui/section-title'
import { Button } from '@/_components/ui/button'
import { useFirebaseAuthContext } from '@/providers/AuthProvider'
import LoadingSpinner from '@/_components/ui/loading-spinner'
import DeleteModal from '@/_components/ui/delete-modal'
import { getUserSettings, updateUserSettings } from './actions'
import toast from 'react-hot-toast'

type Preset = {
  id: string
  name: string
  address: string
}

type FormData = {
  gradeName: string
  className: string
  roomNumber: string
  parentName: string
  presets: Preset[]
}

const getClassOptions = (year: string | undefined) => {
  switch (year) {
    case '1':
    case '2':
      return [
        { label: '1組', value: '1' },
        { label: '2組', value: '2' },
        { label: '3組', value: '3' },
        { label: '4組', value: '4' },
        { label: '5組', value: '5' },
      ]
    case '3':
    case '4':
    case '5':
      return [
        { label: 'I組', value: 'I' },
        { label: 'M組', value: 'M' },
        { label: 'E組', value: 'E' },
        { label: 'CA組', value: 'CA' },
      ]
    default:
      return []
  }
}

export default function Setting() {
  const { currentUser } = useFirebaseAuthContext()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [presetToDelete, setPresetToDelete] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      gradeName: '',
      className: '',
      roomNumber: '',
      parentName: '',
      presets: [
        { id: '1', name: '', address: '' },
        { id: '2', name: '', address: '' },
      ],
    },
  })

  const watchedGradeName = watch('gradeName')
  const watchedPresets = watch('presets')

  useEffect(() => {
    setValue('className', '')
  }, [watchedGradeName, setValue])

  // ユーザーデータを取得してフォームに設定
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const settingsData = await getUserSettings()
        if (settingsData) {
          setValue('gradeName', settingsData.grade || '')
          setValue('className', settingsData.class || '')
          setValue('roomNumber', settingsData.roomNumber || '')
          setValue('parentName', settingsData.parentName || '')

          // プリセットデータを設定
          const presets = settingsData.presets || []
          if (presets.length === 0) {
            // 0個の場合は空欄2つを用意
            setValue('presets', [
              { id: '1', name: '', address: '' },
              { id: '2', name: '', address: '' },
            ])
          } else {
            // 1個以上の場合、そのまま表示（空欄は追加しない）
            setValue(
              'presets',
              presets.map((p) => ({
                id: p.id || Date.now().toString(),
                name: p.name,
                address: p.address,
              }))
            )
          }
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load user data:', error)
        toast.error('データの取得に失敗しました')
        setIsLoading(false)
      }
    }

    if (currentUser) {
      loadUserData()
    } else {
      setIsLoading(false)
    }
  }, [currentUser, setValue])

  const addPreset = () => {
    const newPreset: Preset = {
      id: Date.now().toString(),
      name: '',
      address: '',
    }
    const currentPresets = watchedPresets || []
    setValue('presets', [...currentPresets, newPreset])
  }

  const openDeleteDialog = (id: string) => {
    setPresetToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeletePreset = () => {
    if (presetToDelete) {
      const currentPresets = watchedPresets || []
      if (currentPresets.length > 1) {
        setValue(
          'presets',
          currentPresets.filter((p) => p.id !== presetToDelete)
        )
      }
      setPresetToDelete(null)
    }
  }

  const getPresetName = (id: string) => {
    const preset = watchedPresets?.find((p) => p.id === id)
    return preset?.name || '未設定'
  }

  const onSubmit = async (data: FormData) => {
    setIsSaving(true)
    try {
      await updateUserSettings(
        {
          grade: data.gradeName,
          class: data.className,
          roomNumber: data.roomNumber,
          parentName: data.parentName,
        },
        data.presets.map((preset) => ({
          id: preset.id,
          name: preset.name,
          address: preset.address,
        }))
      )
      toast.success('保存しました')
    } catch (error) {
      console.error('Failed to save:', error)
      toast.error('保存に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center flex-grow">
        <LoadingSpinner size={48} />
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-grow overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-24">
        {/* 個人情報セクション */}
        <div className="flex flex-col gap-4">
          <SectionTitle title="個人情報" />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-(--sub-text)">氏名</p>
              <p className="text-base font-medium">{currentUser?.displayName || '未設定'}</p>
            </div>

            <InputLabel label="学年・クラス">
              <div className="flex w-full items-start gap-2">
                <div className="w-full">
                  <Controller
                    name="gradeName"
                    control={control}
                    rules={{ required: '学年を選択してください' }}
                    render={({ field }) => (
                      <BaseSelect
                        {...field}
                        placeholder="学年"
                        options={[
                          { label: '1年生', value: '1' },
                          { label: '2年生', value: '2' },
                          { label: '3年生', value: '3' },
                          { label: '4年生', value: '4' },
                          { label: '5年生', value: '5' },
                        ]}
                        className="w-full"
                      />
                    )}
                  />
                  {errors.gradeName && <p className="text-red-500 text-sm mt-1">{errors.gradeName.message}</p>}
                </div>
                <div className="w-full">
                  <Controller
                    name="className"
                    control={control}
                    rules={{ required: 'クラスを選択してください' }}
                    render={({ field }) => (
                      <BaseSelect
                        {...field}
                        placeholder="クラス"
                        options={getClassOptions(watchedGradeName)}
                        disabled={!watchedGradeName}
                        className="w-full"
                      />
                    )}
                  />
                  {errors.className && <p className="text-red-500 text-sm mt-1">{errors.className.message}</p>}
                </div>
              </div>
            </InputLabel>

            <InputLabel label="部屋番号">
              <Controller
                name="roomNumber"
                control={control}
                rules={{
                  required: '部屋番号を入力してください',
                  pattern: {
                    value: /^\d{4}$/,
                    message: '部屋番号は4桁の数字で入力してください',
                  },
                }}
                render={({ field }) => <BaseInput {...field} placeholder="例: 2001" type="text" fullWidth />}
              />
              {errors.roomNumber && <p className="text-red-500 text-sm mt-1">{errors.roomNumber.message}</p>}
            </InputLabel>

            <InputLabel label="保護者氏名">
              <Controller
                name="parentName"
                control={control}
                rules={{
                  required: '保護者氏名を入力してください',
                  pattern: {
                    value: /^[^\s ]+$/,
                    message: '名字と名前の間に空白を入れずに入力してください',
                  },
                }}
                render={({ field }) => <BaseInput {...field} placeholder="例: 高専花子" fullWidth />}
              />
              {errors.parentName && <p className="text-red-500 text-sm mt-1">{errors.parentName.message}</p>}
            </InputLabel>
          </div>
        </div>

        {/* プリセットセクション */}
        <div className="flex flex-col gap-4">
          <SectionTitle title="個人情報" />
          <div className="flex flex-col gap-4">
            {watchedPresets.map((preset, index) => (
              <div
                key={preset.id}
                className="flex flex-col gap-4 bg-white rounded-md p-4 border border-(--border-gray)"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold">プリセット #{index + 1}</h3>
                  {watchedPresets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => openDeleteDialog(preset.id)}
                      className="flex items-center gap-2 px-3 py-2 text-(--red) text-sm font-medium hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 size={18} />
                      削除
                    </button>
                  )}
                </div>

                <InputLabel label="プリセット名">
                  <Controller
                    name={`presets.${index}.name`}
                    control={control}
                    render={({ field }) => <BaseInput {...field} placeholder="例: 実家" fullWidth />}
                  />
                </InputLabel>

                <InputLabel label="住所">
                  <Controller
                    name={`presets.${index}.address`}
                    control={control}
                    render={({ field }) => <BaseInput {...field} placeholder="例: 大阪府大阪市..." fullWidth />}
                  />
                </InputLabel>
              </div>
            ))}

            <button
              type="button"
              onClick={addPreset}
              className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center self-center"
              aria-label="プリセットを追加"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      </form>

      {/* 保存ボタン */}
      <div className="sticky bottom-0 bg-white pt-4 pb-4 border-t border-(--border-gray) px-4">
        <Button
          type="button"
          fullWidth
          disabled={isSaving}
          onClick={handleSubmit(onSubmit)}
          className="bg-(--main-blue) text-white"
        >
          {isSaving ? <LoadingSpinner size={20} /> : '保存する'}
        </Button>
      </div>

      {/* 削除確認モーダル */}
      <DeleteModal
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) {
            setPresetToDelete(null)
          }
        }}
        title="プリセットを削除しますか？"
        itemName={presetToDelete ? getPresetName(presetToDelete) : undefined}
        onConfirm={handleDeletePreset}
      />
    </div>
  )
}
