import type { Meta, StoryObj } from '@storybook/nextjs'
import { BaseInput } from '.'

const meta: Meta<typeof BaseInput> = {
  title: 'Input/BaseInput',
  component: BaseInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BaseInput>

export const Default: Story = {
  args: {
    placeholder: 'テキストを入力してください',
  },
}

export const WithIcon: Story = {
  args: {
    placeholder: 'テキストを入力してください',
    icon: 'smile',
  },
}
