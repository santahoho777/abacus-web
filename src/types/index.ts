export interface Lesson {
  id: number
  title: string
  youtubeId: string
  description: string
  topics: string[]
  duration: string
}

export interface Profile {
  id: string
  name: string
  created_at: string
}

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: number
  completed: boolean
  completed_at: string | null
}

export interface LessonWithProgress extends Lesson {
  completed: boolean
}
