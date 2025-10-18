import type { Meta, StoryObj } from '@storybook/nextjs'

import Index from './index'

const meta = {
  title: 'History/Badge',
  component: Index,
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    type: 'pending',
    size: 'small',
  },
}
