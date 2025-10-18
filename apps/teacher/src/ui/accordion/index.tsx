import { Accordion as MantineAccordion } from '@mantine/core'
import styles from './styles.module.css'

type Props = {
  children: React.ReactNode
}

export default function Accordion({ children }: Props) {
  return (
    <MantineAccordion
      variant="contained"
      chevronIconSize={24}
      radius="8px"
      classNames={{
        root: styles.accordionRoot,
        item: styles.accordionItem,
        control: styles.accordionControl,
        content: styles.accordionContent,
      }}
    >
      {children}
    </MantineAccordion>
  )
}
