import type { Meta, StoryObj } from '@storybook/nextjs'

import { DateInput } from './index'

const meta = {
  title: 'Input/DateInput',
  component: DateInput,
} satisfies Meta<typeof DateInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
