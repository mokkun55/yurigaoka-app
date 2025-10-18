'use client'

import NoticeCard from '@/_components/ui/notice-card'

export default function NoticeList() {
  // TODO お知らせ一覧を取得する
  const mockNotices = [
    {
      id: 1,
      title: '[重要] 夏期帰省の申請期限について',
      description: '夏季休暇中の帰省届は7月15日までです。忘れずに提出してください',
      date: '2025/07/03',
    },
    {
      id: 2,
      title: '帰省届の申請時間について',
      description: '平日の帰省届は8:30 ~ 17:00までの間に申請してください。休日はNGです。',
      date: '2025/07/08',
    },
    {
      id: 3,
      title: 'モック1',
      description: 'モック1の説明',
      date: '2025/07/08',
    },
    {
      id: 4,
      title: 'モック2',
      description: 'モック2の説明',
      date: '2025/07/08',
    },
    {
      id: 5,
      title: 'モック3',
      description: 'モック3の説明',
      date: '2025/07/08',
    },
  ]
  return (
    <>
      {mockNotices.map((notice) => (
        <NoticeCard key={notice.id} title={notice.title} description={notice.description} date={notice.date} />
      ))}
    </>
  )
}
