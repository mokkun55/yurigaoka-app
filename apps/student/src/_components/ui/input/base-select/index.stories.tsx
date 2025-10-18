import { Meta, StoryObj } from '@storybook/nextjs'
import { BaseSelect } from '.'

const meta: Meta<typeof BaseSelect> = {
  title: 'Input/BaseSelect',
  component: BaseSelect,
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof BaseSelect> = {
  args: {
    placeholder: 'テーマ',
    options: [
      { label: 'ライト', value: 'light' },
      { label: 'ダーク', value: 'dark' },
      { label: 'システム', value: 'system' },
    ],
  },
}
