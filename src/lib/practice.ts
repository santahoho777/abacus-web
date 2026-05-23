import { PracticeQuestion } from '@/types/gamification'

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // Lesson 1: 認識算盤 — 無口訣基礎
  { id: 'L1Q1', lessonId: 1, question: '算盤上面珠代表幾？', answer: 5 },
  { id: 'L1Q2', lessonId: 1, question: '算盤下面一顆珠代表幾？', answer: 1 },
  { id: 'L1Q3', lessonId: 1, question: '3 + 2 = ?', answer: 5 },
  { id: 'L1Q4', lessonId: 1, question: '4 + 3 = ?', answer: 7 },
  { id: 'L1Q5', lessonId: 1, question: '6 - 2 = ?', answer: 4 },
  { id: 'L1Q6', lessonId: 1, question: '8 - 3 = ?', answer: 5 },
  { id: 'L1Q7', lessonId: 1, question: '2 + 3 + 1 = ?', answer: 6 },
  { id: 'L1Q8', lessonId: 1, question: '5 + 3 - 2 = ?', answer: 6 },

  // Lesson 2: 10的組合加法 — 減補數加10
  { id: 'L2Q1', lessonId: 2, question: '7 + 8 = ?', answer: 15, hint: '8的補數是2，減2加10' },
  { id: 'L2Q2', lessonId: 2, question: '6 + 9 = ?', answer: 15, hint: '9的補數是1，減1加10' },
  { id: 'L2Q3', lessonId: 2, question: '5 + 7 = ?', answer: 12 },
  { id: 'L2Q4', lessonId: 2, question: '8 + 6 = ?', answer: 14 },
  { id: 'L2Q5', lessonId: 2, question: '9 + 4 = ?', answer: 13 },
  { id: 'L2Q6', lessonId: 2, question: '12 + 9 = ?', answer: 21 },
  { id: 'L2Q7', lessonId: 2, question: '24 + 7 = ?', answer: 31 },
  { id: 'L2Q8', lessonId: 2, question: '35 + 8 = ?', answer: 43 },

  // Lesson 3: 10的組合減法 — 減10加補數
  { id: 'L3Q1', lessonId: 3, question: '15 - 8 = ?', answer: 7, hint: '8的補數是2，減10加2' },
  { id: 'L3Q2', lessonId: 3, question: '14 - 6 = ?', answer: 8 },
  { id: 'L3Q3', lessonId: 3, question: '13 - 7 = ?', answer: 6 },
  { id: 'L3Q4', lessonId: 3, question: '21 - 9 = ?', answer: 12 },
  { id: 'L3Q5', lessonId: 3, question: '32 - 8 = ?', answer: 24 },
  { id: 'L3Q6', lessonId: 3, question: '45 - 7 = ?', answer: 38 },
  { id: 'L3Q7', lessonId: 3, question: '20 - 3 = ?', answer: 17 },
  { id: 'L3Q8', lessonId: 3, question: '53 - 6 = ?', answer: 47 },

  // Lesson 4: 5的組合加減法
  { id: 'L4Q1', lessonId: 4, question: '3 + 4 = ?', answer: 7, hint: '加4：減1加5' },
  { id: 'L4Q2', lessonId: 4, question: '2 + 3 = ?', answer: 5 },
  { id: 'L4Q3', lessonId: 4, question: '1 + 4 = ?', answer: 5 },
  { id: 'L4Q4', lessonId: 4, question: '8 - 4 = ?', answer: 4, hint: '減4：減5加1' },
  { id: 'L4Q5', lessonId: 4, question: '7 - 3 = ?', answer: 4 },
  { id: 'L4Q6', lessonId: 4, question: '13 + 4 = ?', answer: 17 },
  { id: 'L4Q7', lessonId: 4, question: '22 - 3 = ?', answer: 19 },
  { id: 'L4Q8', lessonId: 4, question: '31 + 2 = ?', answer: 33 },

  // Lesson 5: 綜合口訣
  { id: 'L5Q1', lessonId: 5, question: '36 + 49 = ?', answer: 85 },
  { id: 'L5Q2', lessonId: 5, question: '44 + 28 = ?', answer: 72 },
  { id: 'L5Q3', lessonId: 5, question: '57 - 19 = ?', answer: 38 },
  { id: 'L5Q4', lessonId: 5, question: '82 - 37 = ?', answer: 45 },
  { id: 'L5Q5', lessonId: 5, question: '25 + 48 = ?', answer: 73 },
  { id: 'L5Q6', lessonId: 5, question: '63 - 28 = ?', answer: 35 },
  { id: 'L5Q7', lessonId: 5, question: '14 + 57 = ?', answer: 71 },
  { id: 'L5Q8', lessonId: 5, question: '91 - 46 = ?', answer: 45 },

  // Lesson 6: 總複習
  { id: 'L6Q1', lessonId: 6, question: '45 + 37 = ?', answer: 82 },
  { id: 'L6Q2', lessonId: 6, question: '73 - 28 = ?', answer: 45 },
  { id: 'L6Q3', lessonId: 6, question: '56 + 44 = ?', answer: 100 },
  { id: 'L6Q4', lessonId: 6, question: '88 - 39 = ?', answer: 49 },
  { id: 'L6Q5', lessonId: 6, question: '62 + 29 = ?', answer: 91 },
  { id: 'L6Q6', lessonId: 6, question: '75 - 47 = ?', answer: 28 },
  { id: 'L6Q7', lessonId: 6, question: '33 + 58 = ?', answer: 91 },
  { id: 'L6Q8', lessonId: 6, question: '90 - 63 = ?', answer: 27 },

  // Lesson 7: 珠算 +1 到 +100
  { id: 'L7Q1', lessonId: 7, question: '1+2+3+4+5 = ?', answer: 15 },
  { id: 'L7Q2', lessonId: 7, question: '10+20+30 = ?', answer: 60 },
  { id: 'L7Q3', lessonId: 7, question: '5+15+25 = ?', answer: 45 },
  { id: 'L7Q4', lessonId: 7, question: '11+22+33 = ?', answer: 66 },
  { id: 'L7Q5', lessonId: 7, question: '25+36+14 = ?', answer: 75 },
  { id: 'L7Q6', lessonId: 7, question: '48+27+15 = ?', answer: 90 },
  { id: 'L7Q7', lessonId: 7, question: '13+24+35+18 = ?', answer: 90 },
  { id: 'L7Q8', lessonId: 7, question: '16+27+38+9 = ?', answer: 90 },

  // Lesson 8: 心算
  { id: 'L8Q1', lessonId: 8, question: '47 + 36 = ?', answer: 83 },
  { id: 'L8Q2', lessonId: 8, question: '84 - 57 = ?', answer: 27 },
  { id: 'L8Q3', lessonId: 8, question: '65 + 28 = ?', answer: 93 },
  { id: 'L8Q4', lessonId: 8, question: '72 - 45 = ?', answer: 27 },
  { id: 'L8Q5', lessonId: 8, question: '39 + 54 = ?', answer: 93 },
  { id: 'L8Q6', lessonId: 8, question: '96 - 38 = ?', answer: 58 },
  { id: 'L8Q7', lessonId: 8, question: '58 + 37 = ?', answer: 95 },
  { id: 'L8Q8', lessonId: 8, question: '100 - 43 = ?', answer: 57 },

  // Lesson 9: 九九乘法
  { id: 'L9Q1', lessonId: 9, question: '3 × 4 = ?', answer: 12 },
  { id: 'L9Q2', lessonId: 9, question: '6 × 7 = ?', answer: 42 },
  { id: 'L9Q3', lessonId: 9, question: '8 × 9 = ?', answer: 72 },
  { id: 'L9Q4', lessonId: 9, question: '5 × 6 = ?', answer: 30 },
  { id: 'L9Q5', lessonId: 9, question: '7 × 8 = ?', answer: 56 },
  { id: 'L9Q6', lessonId: 9, question: '9 × 9 = ?', answer: 81 },
  { id: 'L9Q7', lessonId: 9, question: '4 × 7 = ?', answer: 28 },
  { id: 'L9Q8', lessonId: 9, question: '6 × 8 = ?', answer: 48 },
]

export function getQuestionsForLesson(lessonId: number): PracticeQuestion[] {
  return PRACTICE_QUESTIONS.filter((q) => q.lessonId === lessonId)
}
