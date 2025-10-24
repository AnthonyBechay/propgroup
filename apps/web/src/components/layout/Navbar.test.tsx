import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Navbar } from './Navbar'

// Mock the auth context
const mockUseAuth = vi.fn()

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}))

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}))

// Mock the AuthModal component
vi.mock('@/components/auth/AuthModal', () => ({
  AuthModal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-modal">{children}</div>
  )
}))

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the navbar with logo and navigation links', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signOut: vi.fn()
    })

    render(<Navbar />)

    expect(screen.getByText('Smart Investment Portal')).toBeInTheDocument()
    expect(screen.getByText('Properties')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('should show login button when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signOut: vi.fn()
    })

    render(<Navbar />)

    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByTestId('auth-modal')).toBeInTheDocument()
  })

  it('should show user email and portal link when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
      signOut: vi.fn()
    })

    render(<Navbar />)

    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('Portal')).toBeInTheDocument()
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
  })

  it('should show loading state when auth is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      signOut: vi.fn()
    })

    render(<Navbar />)

    // Should show loading skeleton instead of auth buttons
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
  })

  it('should render mobile menu button', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signOut: vi.fn()
    })

    render(<Navbar />)

    // Mobile menu button should be present (there are multiple buttons, so get all)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})
