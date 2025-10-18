import type { Meta, StoryObj } from '@storybook/nextjs'

import { TimeInput } from './index'

const meta = {
  title: 'Input/TimeInput',
  component: TimeInput,
} satisfies Meta<typeof TimeInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
