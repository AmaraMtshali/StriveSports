import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import SignRedirect from '../adminResources/SignRedirect';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('SignRedirect', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('redirects resident to /residentDashboard', () => {
    const user = { publicMetadata: { role: 'resident' } };

    render(
      <MemoryRouter>
        <SignRedirect {...user} />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/residentDashboard');
  });

  test('redirects admin to /adminDashboard', () => {
    const user = { publicMetadata: { role: 'admin' } };

    render(
      <MemoryRouter>
        <SignRedirect {...user} />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/adminDashboard');
  });

  test('redirects to /residentDashboard if no role is defined', () => {
    const user = { publicMetadata: {} };

    render(
      <MemoryRouter>
        <SignRedirect {...user} />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/residentDashboard');
  });
});
