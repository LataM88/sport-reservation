import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { ProtectedRoute } from './ProtectedRoute';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../context/AuthContext';
const mockUseAuth = vi.mocked(useAuth);

const renderWithRouter = (initialRoute: string = '/protected') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div data-testid="protected-content">Chroniona treść</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={<div data-testid="login-page">Login</div>}
        />
        <Route
          path="/admin/dashboard"
          element={<div data-testid="admin-dashboard">Admin</div>}
        />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', () => {
    // Arrange
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
      token: null,
      userId: null,
      role: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    // Act
    renderWithRouter();

    // Assert
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('redirects admin to /admin/dashboard', () => {
    // Arrange
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isAdmin: true,
      token: 'token',
      userId: '1',
      role: 'admin',
      login: vi.fn(),
      logout: vi.fn(),
    });

    // Act
    renderWithRouter();

    // Assert
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('renders children when authenticated as regular user', () => {
    // Arrange
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
      token: 'token',
      userId: '1',
      role: 'user',
      login: vi.fn(),
      logout: vi.fn(),
    });

    // Act
    renderWithRouter();

    // Assert
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Chroniona treść')).toBeInTheDocument();
  });
});
