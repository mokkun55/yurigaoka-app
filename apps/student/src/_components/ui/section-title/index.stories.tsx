import type { Meta, StoryObj } from '@storybook/nextjs'

import Index from './index'

const meta = {
  title: 'section-title',
  component: Index,
  argTypes: {
    isMargin: {
      control: 'boolean',
      defaultValue: true,
    },
  },
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'セクションタイトル',
  },
}
