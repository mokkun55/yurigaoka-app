'use server'

import { fetchAllStudents } from '@/firestore/user-operations'
import { User } from '@yurigaoka-app/common'

export async function getAllStudents(): Promise<User[]> {
  try {
    const students = await fetchAllStudents()
    return students
  } catch (error) {
    console.error('Failed to fetch students:', error)
    throw error
  }
}
