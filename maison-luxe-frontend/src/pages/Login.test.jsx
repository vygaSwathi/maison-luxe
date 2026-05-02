import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Login from './Login'

const loginMock = vi.fn(async () => ({}))
const navigateMock = vi.fn()

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: loginMock }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('Login flow', () => {
  it('submits credentials and redirects home', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    await userEvent.type(screen.getByPlaceholderText('Email'), 'admin@example.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'secret123')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(loginMock).toHaveBeenCalledWith('admin@example.com', 'secret123')
    expect(navigateMock).toHaveBeenCalledWith('/')
  })
})
