'use client'

import { Button } from '@/_components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/_components/ui/dialog'

type Props = {
  open: boolean
  onOpenChange: (_open: boolean) => void
  title?: string
  description?: string
  itemName?: string
  onConfirm: () => void
  confirmLabel?: string
  cancelLabel?: string
}

export default function DeleteModal({
  open,
  onOpenChange,
  title = '削除しますか？',
  description,
  itemName,
  onConfirm,
  confirmLabel = '削除する',
  cancelLabel = 'キャンセル',
}: Props) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description || (
              <>
                {itemName && <>「{itemName}」を削除します。</>}
                {!itemName && 'このアイテムを削除します。'}
                <br />
                この操作は取り消せません。
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="!flex !flex-col gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} fullWidth>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            fullWidth
            className="bg-(--red) text-white"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
