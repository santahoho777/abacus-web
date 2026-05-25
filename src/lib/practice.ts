import { PracticeQuestion } from '@/types/gamification'

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // Lesson 1: 準十二級 — 3數，1-5，全加
  { id: 'L1Q1', lessonId: 1, numbers: [1, 2, 5], answer: 8 },
  { id: 'L1Q2', lessonId: 1, numbers: [3, 5, 1], answer: 9 },
  { id: 'L1Q3', lessonId: 1, numbers: [2, 4, 3], answer: 9 },
  { id: 'L1Q4', lessonId: 1, numbers: [5, 1, 2], answer: 8 },
  { id: 'L1Q5', lessonId: 1, numbers: [4, 3, 2], answer: 9 },
  { id: 'L1Q6', lessonId: 1, numbers: [2, 3, 4], answer: 9 },
  { id: 'L1Q7', lessonId: 1, numbers: [1, 5, 3], answer: 9 },
  { id: 'L1Q8', lessonId: 1, numbers: [3, 2, 5], answer: 10 },

  // Lesson 2: 準十二級 — 3數，1-5，全加（進階）
  { id: 'L2Q1', lessonId: 2, numbers: [4, 1, 3], answer: 8 },
  { id: 'L2Q2', lessonId: 2, numbers: [2, 5, 1], answer: 8 },
  { id: 'L2Q3', lessonId: 2, numbers: [1, 4, 4], answer: 9 },
  { id: 'L2Q4', lessonId: 2, numbers: [3, 3, 3], answer: 9 },
  { id: 'L2Q5', lessonId: 2, numbers: [5, 2, 3], answer: 10 },
  { id: 'L2Q6', lessonId: 2, numbers: [1, 3, 5], answer: 9 },
  { id: 'L2Q7', lessonId: 2, numbers: [4, 4, 1], answer: 9 },
  { id: 'L2Q8', lessonId: 2, numbers: [2, 2, 5], answer: 9 },

  // Lesson 3: 十二級 — 3數，1-9，全加
  { id: 'L3Q1', lessonId: 3, numbers: [7, 8, 5], answer: 20, hint: '先算前兩個，再加第三個' },
  { id: 'L3Q2', lessonId: 3, numbers: [2, 6, 7], answer: 15 },
  { id: 'L3Q3', lessonId: 3, numbers: [8, 3, 6], answer: 17 },
  { id: 'L3Q4', lessonId: 3, numbers: [5, 9, 3], answer: 17 },
  { id: 'L3Q5', lessonId: 3, numbers: [6, 1, 8], answer: 15 },
  { id: 'L3Q6', lessonId: 3, numbers: [9, 4, 7], answer: 20 },
  { id: 'L3Q7', lessonId: 3, numbers: [3, 8, 9], answer: 20 },
  { id: 'L3Q8', lessonId: 3, numbers: [7, 6, 4], answer: 17 },

  // Lesson 4: 十一級 — 4數，1-9，全加
  { id: 'L4Q1', lessonId: 4, numbers: [4, 7, 9, 6], answer: 26 },
  { id: 'L4Q2', lessonId: 4, numbers: [8, 5, 3, 7], answer: 23 },
  { id: 'L4Q3', lessonId: 4, numbers: [6, 9, 8, 4], answer: 27 },
  { id: 'L4Q4', lessonId: 4, numbers: [7, 3, 9, 5], answer: 24 },
  { id: 'L4Q5', lessonId: 4, numbers: [9, 6, 7, 3], answer: 25 },
  { id: 'L4Q6', lessonId: 4, numbers: [5, 8, 9, 6], answer: 28 },
  { id: 'L4Q7', lessonId: 4, numbers: [3, 7, 6, 8], answer: 24 },
  { id: 'L4Q8', lessonId: 4, numbers: [9, 4, 8, 7], answer: 28 },

  // Lesson 5: 十一級 — 4數，湊5法
  { id: 'L5Q1', lessonId: 5, numbers: [3, 4, 8, 6], answer: 21, hint: '遇到湊成5時，減補數加5' },
  { id: 'L5Q2', lessonId: 5, numbers: [4, 3, 7, 9], answer: 23 },
  { id: 'L5Q3', lessonId: 5, numbers: [6, 4, 3, 8], answer: 21 },
  { id: 'L5Q4', lessonId: 5, numbers: [9, 3, 4, 7], answer: 23 },
  { id: 'L5Q5', lessonId: 5, numbers: [8, 4, 3, 6], answer: 21 },
  { id: 'L5Q6', lessonId: 5, numbers: [7, 3, 4, 9], answer: 23 },
  { id: 'L5Q7', lessonId: 5, numbers: [4, 4, 9, 6], answer: 23 },
  { id: 'L5Q8', lessonId: 5, numbers: [3, 3, 8, 7], answer: 21 },

  // Lesson 6: 十一級 — 4數，湊10法
  { id: 'L6Q1', lessonId: 6, numbers: [6, 5, 7, 8], answer: 26, hint: '遇到湊成10時，減補數加10' },
  { id: 'L6Q2', lessonId: 6, numbers: [7, 4, 9, 6], answer: 26 },
  { id: 'L6Q3', lessonId: 6, numbers: [8, 6, 4, 9], answer: 27 },
  { id: 'L6Q4', lessonId: 6, numbers: [5, 7, 8, 6], answer: 26 },
  { id: 'L6Q5', lessonId: 6, numbers: [9, 7, 5, 8], answer: 29 },
  { id: 'L6Q6', lessonId: 6, numbers: [6, 8, 7, 5], answer: 26 },
  { id: 'L6Q7', lessonId: 6, numbers: [8, 7, 6, 9], answer: 30 },
  { id: 'L6Q8', lessonId: 6, numbers: [7, 9, 8, 6], answer: 30 },

  // Lesson 7: 十級 — 4數，含減法
  { id: 'L7Q1', lessonId: 7, numbers: [8, 3, -2, 6], answer: 15, hint: '負數表示減，例如 -2 就是減2' },
  { id: 'L7Q2', lessonId: 7, numbers: [7, 5, -3, 4], answer: 13 },
  { id: 'L7Q3', lessonId: 7, numbers: [9, 4, -2, 5], answer: 16 },
  { id: 'L7Q4', lessonId: 7, numbers: [6, 8, -4, 3], answer: 13 },
  { id: 'L7Q5', lessonId: 7, numbers: [5, 7, -3, 8], answer: 17 },
  { id: 'L7Q6', lessonId: 7, numbers: [8, 6, -5, 4], answer: 13 },
  { id: 'L7Q7', lessonId: 7, numbers: [9, 7, -4, 6], answer: 18 },
  { id: 'L7Q8', lessonId: 7, numbers: [7, 8, -3, 5], answer: 17 },

  // Lesson 8: 九/十級 — 5數，含減法
  { id: 'L8Q1', lessonId: 8, numbers: [9, -4, 8, 3, -2], answer: 14, hint: '依序計算，紅色是減法' },
  { id: 'L8Q2', lessonId: 8, numbers: [7, 6, -3, 8, -4], answer: 14 },
  { id: 'L8Q3', lessonId: 8, numbers: [8, -3, 9, 5, -2], answer: 17 },
  { id: 'L8Q4', lessonId: 8, numbers: [6, 9, -4, 7, -3], answer: 15 },
  { id: 'L8Q5', lessonId: 8, numbers: [9, -2, 7, -4, 8], answer: 18 },
  { id: 'L8Q6', lessonId: 8, numbers: [5, 8, -3, 9, -2], answer: 17 },
  { id: 'L8Q7', lessonId: 8, numbers: [8, 7, -5, 6, -3], answer: 13 },
  { id: 'L8Q8', lessonId: 8, numbers: [9, -3, 6, 8, -4], answer: 16 },

  // Lesson 9: 九級 — 5數，含減法（進階）
  { id: 'L9Q1', lessonId: 9, numbers: [7, 9, 6, 3, 8], answer: 33 },
  { id: 'L9Q2', lessonId: 9, numbers: [8, -1, 9, 7, 6], answer: 29 },
  { id: 'L9Q3', lessonId: 9, numbers: [9, 7, -4, 8, 6], answer: 26 },
  { id: 'L9Q4', lessonId: 9, numbers: [6, 9, 3, -7, 8], answer: 19 },
  { id: 'L9Q5', lessonId: 9, numbers: [5, 8, 9, 7, -9], answer: 20 },
  { id: 'L9Q6', lessonId: 9, numbers: [9, -3, 8, 6, 7], answer: 27 },
  { id: 'L9Q7', lessonId: 9, numbers: [7, 8, -6, 9, 5], answer: 23 },
  { id: 'L9Q8', lessonId: 9, numbers: [8, 6, 9, -7, 5], answer: 21 },
]

export function getQuestionsForLesson(lessonId: number): PracticeQuestion[] {
  return PRACTICE_QUESTIONS.filter((q) => q.lessonId === lessonId)
}
