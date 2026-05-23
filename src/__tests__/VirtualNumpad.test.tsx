import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import VirtualNumpad from '@/components/VirtualNumpad'

describe('VirtualNumpad', () => {
  it('renders digits 0-9', () => {
    render(<VirtualNumpad value="" onChange={() => {}} onSubmit={() => {}} />)
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument()
    }
  })

  it('calls onChange when digit pressed', () => {
    const onChange = vi.fn()
    render(<VirtualNumpad value="" onChange={onChange} onSubmit={() => {}} />)
    fireEvent.click(screen.getByText('7'))
    expect(onChange).toHaveBeenCalledWith('7')
  })

  it('calls onChange with trimmed string when delete pressed', () => {
    const onChange = vi.fn()
    render(<VirtualNumpad value="42" onChange={onChange} onSubmit={() => {}} />)
    fireEvent.click(screen.getByText('⌫'))
    expect(onChange).toHaveBeenCalledWith('4')
  })

  it('calls onSubmit when OK pressed', () => {
    const onSubmit = vi.fn()
    render(<VirtualNumpad value="42" onChange={() => {}} onSubmit={onSubmit} />)
    fireEvent.click(screen.getByText('確認'))
    expect(onSubmit).toHaveBeenCalled()
  })
})
