'use client'

import { User } from '@yurigaoka-app/common'
import { Table } from '@mantine/core'

type Props = {
  students: User[]
}

export default function StudentTable({ students }: Props) {
  const rows = students.map((student) => {
    const isUnaffiliated = student.club === '未所属/その他'

    return (
      <Table.Tr key={student.id}>
        <Table.Td>{student.grade && student.class ? `${student.grade}年${student.class}組` : '-'}</Table.Td>
        <Table.Td>{student.name}</Table.Td>
        <Table.Td style={{ color: isUnaffiliated ? '#999' : 'inherit' }}>{student.club || '-'}</Table.Td>
        <Table.Td>{student.roomNumber ? `${student.roomNumber}号室` : '-'}</Table.Td>
      </Table.Tr>
    )
  })

  return (
    <Table verticalSpacing="sm" stickyHeader>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>学年</Table.Th>
          <Table.Th>名前</Table.Th>
          <Table.Th>部活動</Table.Th>
          <Table.Th>部屋番号</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  )
}
