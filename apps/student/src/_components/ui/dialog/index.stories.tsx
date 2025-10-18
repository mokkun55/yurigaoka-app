import { Button } from '@/_components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/_components/ui/dialog'

import type { Meta, StoryObj } from '@storybook/nextjs'

const DialogMock = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ダイアログタイトル</DialogTitle>
          <DialogDescription>
            ダイアログの説明文 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod eveniet, magnam cumque
            saepe unde, veritatis, qui reprehenderit quaerat atque laborum repellat? Laboriosam necessitatibus suscipit
            odit molestiae minus amet cum.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2">
          <Button>ボタン1</Button>
          <Button>ボタン2</Button>

          <DialogClose asChild>
            <Button>閉じる</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const meta = {
  title: 'Dialog',
  component: DialogMock,
  tags: ['autodocs'],
} satisfies Meta<typeof DialogMock>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // propsをここに追加
  },
}
