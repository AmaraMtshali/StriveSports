import React from 'react';
import { render, screen } from '@testing-library/react';
import ProtectedRoute from '../utils/ProtectedRoutes';
import '@testing-library/jest-dom';

// Mock useAuth
jest.mock('@clerk/clerk-react', () => ({
  useAuth: jest.fn()
}));

// Mock Navigate and Outlet
jest.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div data-testid="navigate">Navigate to {to}</div>,
  Outlet: () => <div data-testid="outlet">Protected Content</div>
}));

import { useAuth } from '@clerk/clerk-react';

describe('ProtectedRoute', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Basic functional tests (keep existing)
  test('shows loading when not loaded', () => {
    useAuth.mockReturnValue({ isLoaded: false });

    render(<ProtectedRoute allowedRoles={['admin']} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('redirects when no userId', () => {
    useAuth.mockReturnValue({ isLoaded: true, userId: null });

    render(<ProtectedRoute allowedRoles={['admin']} />);
    expect(screen.getByTestId('navigate')).toHaveTextContent('Navigate to /');
  });

  test('redirects when no user role', () => {
    useAuth.mockReturnValue({
      isLoaded: true,
      userId: '123',
      sessionClaims: { publicMetadata: { role: null } }
    });

    render(<ProtectedRoute allowedRoles={['admin']} />);
    expect(screen.getByTestId('navigate')).toHaveTextContent('Navigate to /');
  });

  test('renders Outlet when user role is allowed', () => {
    useAuth.mockReturnValue({
      isLoaded: true,
      userId: '123',
      sessionClaims: { publicMetadata: { role: 'admin' } }
    });

    render(<ProtectedRoute allowedRoles={['admin', 'user']} />);
    expect(screen.getByTestId('outlet')).toHaveTextContent('Protected Content');
  });

  test('redirects when user role is not allowed', () => {
    useAuth.mockReturnValue({
      isLoaded: true,
      userId: '123',
      sessionClaims: { publicMetadata: { role: 'guest' } }
    });

    render(<ProtectedRoute allowedRoles={['admin', 'user']} />);
    expect(screen.getByTestId('navigate')).toHaveTextContent('Navigate to /');
  });

  test('handles empty allowedRoles (boundary) - no access', () => {
    useAuth.mockReturnValue({
      isLoaded: true,
      userId: '123',
      sessionClaims: { publicMetadata: { role: 'admin' } }
    });

    render(<ProtectedRoute allowedRoles={[]} />);
    expect(screen.getByTestId('navigate')).toHaveTextContent('Navigate to /');
  });

  test('handles one-role allowedRoles (boundary) - access granted', () => {
    useAuth.mockReturnValue({
      isLoaded: true,
      userId: '123',
      sessionClaims: { publicMetadata: { role: 'user' } }
    });

    render(<ProtectedRoute allowedRoles={['user']} />);
    expect(screen.getByTestId('outlet')).toHaveTextContent('Protected Content');
  });

  test('handles one-role allowedRoles (boundary) - access denied', () => {
    useAuth.mockReturnValue({
      isLoaded: true,
      userId: '123',
      sessionClaims: { publicMetadata: { role: 'guest' } }
    });

    render(<ProtectedRoute allowedRoles={['admin']} />);
    expect(screen.getByTestId('navigate')).toHaveTextContent('Navigate to /');
  });

  // Equivalence testing
  test('valid roles group (equivalence) - access granted', () => {
    const validRoles = ['admin', 'manager', 'editor'];
    useAuth.mockReturnValue({
      isLoaded: true,
      userId: '123',
      sessionClaims: { publicMetadata: { role: 'manager' } }
    });

    render(<ProtectedRoute allowedRoles={validRoles} />);
    expect(screen.getByTestId('outlet')).toHaveTextContent('Protected Content');
  });

  test('invalid roles group (equivalence) - access denied', () => {
    const validRoles = ['admin', 'manager', 'editor'];
    useAuth.mockReturnValue({
      isLoaded: true,
      userId: '123',
      sessionClaims: { publicMetadata: { role: 'viewer' } }
    });

    render(<ProtectedRoute allowedRoles={validRoles} />);
    expect(screen.getByTestId('navigate')).toHaveTextContent('Navigate to /');
  });

  test('unexpected role type (edge case) - access denied', () => {
    useAuth.mockReturnValue({
      isLoaded: true,
      userId: '123',
      sessionClaims: { publicMetadata: { role: 12345 } } // number instead of string
    });

    render(<ProtectedRoute allowedRoles={['admin', 'user']} />);
    expect(screen.getByTestId('navigate')).toHaveTextContent('Navigate to /');
  });

  test('missing sessionClaims object (edge case) - access denied', () => {
    useAuth.mockReturnValue({
      isLoaded: true,
      userId: '123',
      sessionClaims: null
    });

    render(<ProtectedRoute allowedRoles={['admin', 'user']} />);
    expect(screen.getByTestId('navigate')).toHaveTextContent('Navigate to /');
  });
});
