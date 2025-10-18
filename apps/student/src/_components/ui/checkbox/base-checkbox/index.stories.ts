import { Meta, StoryObj } from '@storybook/nextjs'
import { BaseCheckbox } from '.'

const meta: Meta<typeof BaseCheckbox> = {
  title: 'Checkbox/BaseCheckbox',
  component: BaseCheckbox,
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof BaseCheckbox> = {}

export const WithLabel: StoryObj<typeof BaseCheckbox> = {
  args: {
    label: 'ラベル',
  },
}
