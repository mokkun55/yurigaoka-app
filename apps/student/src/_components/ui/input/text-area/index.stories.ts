import { Meta, StoryObj } from '@storybook/nextjs'
import { Textarea } from '.'

const meta: Meta<typeof Textarea> = {
  title: 'Input/Textarea',
  component: Textarea,
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof Textarea> = {
  args: {
    placeholder: 'テキストを入力してください',
  },
}
