import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '../App';
import '@testing-library/jest-dom';

// Mocks
jest.mock('@clerk/clerk-react', () => ({
  SignedIn: ({ children }) => <div data-testid="signed-in">{children}</div>,
  SignedOut: ({ children }) => <div data-testid="signed-out">{children}</div>,
}));

jest.mock('../afterSignInRedirect', () => () => <div>Redirect Component</div>);
jest.mock('../Landing', () => () => <div>Landing Page</div>);
jest.mock('../pages/WelcomeScreen', () => () => <div>Welcome Screen</div>);
jest.mock('../adminResources/AdminDashboard', () => () => <div>Admin Dashboard</div>);
jest.mock('../pages/resident', () => () => <div>Resident Page</div>);
jest.mock('../adminResources/BlockedUser', () => () => <div>Blocked User Page</div>);
jest.mock('../pages/onboard3', () => () => <div>Onboard Page</div>);
jest.mock('../pages/facilityStaff', () => () => <div>Facility Staff Page</div>);

describe('App Routing', () => {
  test('renders Landing page on "/"', () => {
    render(<App />, { wrapper: MemoryRouter });
    expect(screen.getByText('Landing Page')).toBeInTheDocument();
  });

  test('renders Welcome screen on "/pages/WelcomeScreen"', () => {
    render(
      <MemoryRouter initialEntries={['/pages/WelcomeScreen']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Welcome Screen')).toBeInTheDocument();
  });

  test('renders AdminDashboard on "/adminResources/AdminDashboard"', () => {
    render(
      <MemoryRouter initialEntries={['/adminResources/AdminDashboard']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  test('renders Redirect component when SignedIn', () => {
    render(<App />, { wrapper: MemoryRouter });
    expect(screen.getByTestId('signed-in')).toBeInTheDocument();
    expect(screen.getByText('Redirect Component')).toBeInTheDocument();
  });

  test('renders SignedOut section (even if empty)', () => {
    render(<App />, { wrapper: MemoryRouter });
    expect(screen.getByTestId('signed-out')).toBeInTheDocument();
  });
});
