import { type MantineSpacing, type MantineRadius, Modal, type MantineSize } from '@mantine/core'

type Props = {
  opened: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  radius?: MantineRadius | string
  padding?: MantineSpacing | string
  withCloseButton?: boolean
  center?: boolean
  size?: number | MantineSize | (string & {}) | string
}

export default function BaseModal({
  opened,
  onClose,
  title,
  children,
  size = 'lg',
  radius = '8px',
  padding = '24px',
  withCloseButton = false,
  center = true,
}: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      radius={radius}
      padding={padding}
      withCloseButton={withCloseButton}
      title={title}
      size={size}
      centered={center}
    >
      <div>{children}</div>
    </Modal>
  )
}
