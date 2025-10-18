import React from 'react'

type NoticeCardProps = {
  title: string
  description: string
  date: string
}

const NoticeCard: React.FC<NoticeCardProps> = ({ title, description, date }) => (
  <div className="flex flex-col text-left bg-white rounded-md p-4 border border-(--border-gray)">
    <p className="text-base font-bold">{title}</p>
    <p className="text-base text-(--sub-text)">{description}</p>
    <p className="text-sm text-(--sub-text) text-right">{date}</p>
  </div>
)

export default NoticeCard
