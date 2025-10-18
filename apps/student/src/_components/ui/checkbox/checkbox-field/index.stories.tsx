import type { Meta, StoryObj } from '@storybook/nextjs'

import { CheckboxField } from './index'

const meta = {
  title: 'Checkbox/CheckboxField',
  component: CheckboxField,
} satisfies Meta<typeof CheckboxField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'CheckboxField',
  },
}
