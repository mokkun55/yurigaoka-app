'use client'

import { Report } from '../../_type/report'
import { Table } from '@mantine/core'
import Badge from '@/ui/badge'
import dayjs from '@/libs/dayjs'
import BaseModal from '@/ui/base-modal'
import { useDisclosure } from '@mantine/hooks'
import DetailModal from '../detail-modal'
import { useState } from 'react'

type Props = {
  reports: Report[]
}

const reportTypeMap = {
  homecoming: '帰省・欠食届',
  meal: '欠食届のみ',
}

export default function ReportTable({ reports }: Props) {
  const [modalOpened, { open: modalOpen, close: modalClose }] = useDisclosure(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  const handleDetailClick = (report: Report) => {
    setSelectedReport(report)
    modalOpen()
  }

  const rows = reports.map((report) => {
    return (
      <Table.Tr key={report.id} onClick={() => handleDetailClick(report)} style={{ cursor: 'pointer' }}>
        <Table.Td>
          {report.grade}年{report.class}組
        </Table.Td>
        <Table.Td>{report.name}</Table.Td>
        <Table.Td>{dayjs(report.createdAt).format('YYYY/MM/DD')}</Table.Td>
        <Table.Td>{reportTypeMap[report.type]}</Table.Td>
        <Table.Td>{<Badge variant={report.status} />}</Table.Td>
      </Table.Tr>
    )
  })

  return (
    <>
      <Table verticalSpacing="sm" stickyHeader highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>学年クラス</Table.Th>
            <Table.Th>名前</Table.Th>
            <Table.Th>申請日</Table.Th>
            <Table.Th>申請種別</Table.Th>
            <Table.Th>ステータス</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <BaseModal opened={modalOpened} onClose={modalClose}>
        {selectedReport && <DetailModal report={selectedReport} onClose={modalClose} />}
      </BaseModal>
    </>
  )
}
