import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LessonCard from '@/components/LessonCard'
import { LESSONS } from '@/lib/lessons'

describe('LessonCard', () => {
  const lesson = LESSONS[0]

  it('renders lesson title', () => {
    render(<LessonCard lesson={lesson} completed={false} />)
    expect(screen.getByText(lesson.title)).toBeInTheDocument()
  })

  it('renders lesson number', () => {
    render(<LessonCard lesson={lesson} completed={false} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('shows completed badge when completed', () => {
    render(<LessonCard lesson={lesson} completed={true} />)
    expect(screen.getByText('已完成')).toBeInTheDocument()
  })

  it('does not show completed badge when not completed', () => {
    render(<LessonCard lesson={lesson} completed={false} />)
    expect(screen.queryByText('已完成')).not.toBeInTheDocument()
  })

  it('renders link to correct lesson page', () => {
    render(<LessonCard lesson={lesson} completed={false} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/courses/${lesson.id}`)
  })
})
