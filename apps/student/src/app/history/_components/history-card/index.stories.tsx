import type { Meta, StoryObj } from '@storybook/nextjs'
import HomeHistoryCard from './HomeHistoryCard'
import MealHistoryCard from './MealHistoryCard'

const metaHome: Meta<typeof HomeHistoryCard> = {
  title: 'History/HomeHistoryCard',
  component: HomeHistoryCard,
}
export default metaHome

type StoryHome = StoryObj<typeof HomeHistoryCard>

type StoryMeal = StoryObj<typeof MealHistoryCard>

export const Homecoming: StoryHome = {
  args: {
    status: 'pending',
    createdAt: '2025/01/01',
    period: {
      startDate: new Date('2025/01/01 18:00'),
      endDate: new Date('2025/01/10 20:00'),
    },
    homecoming: {
      id: '1',
      place: '実家',
    },
    meal: {
      startDate: {
        morning: true,
        evening: false,
      },
      endDate: {
        morning: false,
        evening: true,
      },
    },
  },
}

export const Meal: StoryMeal = {
  render: () => (
    <MealHistoryCard
      status="approved"
      createdAt="2025/01/01"
      period={{
        startDate: new Date('2025/01/01 18:00'),
        endDate: new Date('2025/01/10 20:00'),
      }}
      meal={{
        startDate: {
          morning: true,
          evening: false,
        },
        endDate: {
          morning: false,
          evening: true,
        },
      }}
    />
  ),
}
