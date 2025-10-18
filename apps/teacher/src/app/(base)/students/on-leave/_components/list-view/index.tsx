import styles from './styles.module.css'
import StudentList from './_components/student-list'

// あとで動的に取得する
const mockStudentData = [
  {
    id: 1,
    grade: 1,
    name: '高専たろう',
    roomNumber: 2001,
    startDate: new Date('2025-06-05T18:00:00'),
    endDate: new Date('2025-06-08T20:00:00'),
  },
  {
    id: 2,
    grade: 2,
    name: '田中空',
    roomNumber: 2002,
    startDate: new Date('2025-06-05T18:00:00'),
    endDate: new Date('2025-06-08T20:00:00'),
  },
  {
    id: 3,
    grade: 2,
    name: '新田景池',
    roomNumber: 3001,
    startDate: new Date('2025-06-05T18:00:00'),
    endDate: new Date('2025-06-08T20:00:00'),
  },
  {
    id: 4,
    grade: 1,
    name: '栗田心',
    roomNumber: 2001,
    startDate: new Date('2025-06-05T18:00:00'),
    endDate: new Date('2025-06-08T20:00:00'),
  },
  {
    id: 5,
    grade: 1,
    name: '高専たろう',
    roomNumber: 2001,
    startDate: new Date('2025-06-05T18:00:00'),
    endDate: new Date('2025-06-08T20:00:00'),
  },
  {
    id: 6,
    grade: 1,
    name: '高専たろう',
    roomNumber: 2001,
    startDate: new Date('2025-06-05T18:00:00'),
    endDate: new Date('2025-06-08T20:00:00'),
  },
  {
    id: 7,
    grade: 3,
    name: '山田太郎',
    roomNumber: 3002,
    startDate: new Date('2025-06-06T19:00:00'),
    endDate: new Date('2025-06-09T21:00:00'),
  },
  {
    id: 8,
    grade: 2,
    name: '佐藤花子',
    roomNumber: 2003,
    startDate: new Date('2025-06-07T17:30:00'),
    endDate: new Date('2025-06-10T19:30:00'),
  },
  {
    id: 9,
    grade: 1,
    name: '鈴木一郎',
    roomNumber: 1001,
    startDate: new Date('2025-06-08T18:30:00'),
    endDate: new Date('2025-06-11T20:30:00'),
  },
  {
    id: 10,
    grade: 3,
    name: '高橋美咲',
    roomNumber: 3003,
    startDate: new Date('2025-06-09T16:00:00'),
    endDate: new Date('2025-06-12T18:00:00'),
  },
  {
    id: 11,
    grade: 2,
    name: '伊藤健太',
    roomNumber: 2004,
    startDate: new Date('2025-06-10T19:00:00'),
    endDate: new Date('2025-06-13T21:00:00'),
  },
  {
    id: 12,
    grade: 1,
    name: '渡辺さくら',
    roomNumber: 1002,
    startDate: new Date('2025-06-11T17:00:00'),
    endDate: new Date('2025-06-14T19:00:00'),
  },
  {
    id: 13,
    grade: 3,
    name: '中村大輔',
    roomNumber: 3004,
    startDate: new Date('2025-06-12T18:30:00'),
    endDate: new Date('2025-06-15T20:30:00'),
  },
  {
    id: 14,
    grade: 2,
    name: '小林あい',
    roomNumber: 2005,
    startDate: new Date('2025-06-13T16:30:00'),
    endDate: new Date('2025-06-16T18:30:00'),
  },
  {
    id: 15,
    grade: 1,
    name: '加藤雄太',
    roomNumber: 1003,
    startDate: new Date('2025-06-14T19:30:00'),
    endDate: new Date('2025-06-17T21:30:00'),
  },
  {
    id: 16,
    grade: 3,
    name: '吉田みゆき',
    roomNumber: 3005,
    startDate: new Date('2025-06-15T17:30:00'),
    endDate: new Date('2025-06-18T19:30:00'),
  },
]

export default function ListView() {
  return (
    <div className={styles.container}>
      {mockStudentData.map((student) => (
        <StudentList
          key={student.id}
          id={student.id}
          grade={student.grade}
          name={student.name}
          roomNumber={student.roomNumber}
          startDate={student.startDate}
          endDate={student.endDate}
        />
      ))}
    </div>
  )
}
