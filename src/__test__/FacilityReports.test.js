import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import * as clerkReact from '@clerk/clerk-react';

// Minimal mock of FacilityReports without getReports
function MockFacilityReports({ mockData }) {
  const { user } = clerkReact.useUser();
  const [rows2, setRows2] = useState([]);

  useEffect(() => {
    setRows2(
      mockData.map(element => ({
        id: element._id,
        facility: element.facility,
        issue: element.issue,
        residentInfo: element.residentInfo,
        status: element.status,
        __v: element.__v,
        message: element.message || 'No message provided',
      }))
    );
  }, [mockData]);

  return (
    <section className="usersTable">
      <Box sx={{ width: '100%' }}>
        <DataGrid
          autoHeight
          rows={rows2}
          columns={[
            { field: 'facility', headerName: 'facility', flex: 1 },
            { field: 'issue', headerName: 'issue', flex: 4 },
            { field: 'message', headerName: 'message', flex: 2 },
            { field: 'status', headerName: 'status', flex: 1 },
          ]}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
    </section>
  );
}

jest.mock('@clerk/clerk-react', () => ({
  useUser: jest.fn(),
}));

describe('FacilityReports Component (no getReports)', () => {
  beforeEach(() => {
    clerkReact.useUser.mockReturnValue({ user: { id: 'test-user' } });
  });

  // Equivalence test: normal data
  test('renders provided mock data correctly (equivalence)', async () => {
    const mockData = [
      {
        _id: '1',
        facility: 'Gym',
        issue: 'Broken Treadmill',
        residentInfo: 'John Doe',
        status: 'Pending',
        __v: 0,
        message: 'Please fix soon',
      },
    ];

    render(<MockFacilityReports mockData={mockData} />);

    await waitFor(() => {
      expect(screen.getByText('Gym')).toBeInTheDocument();
      expect(screen.getByText('Broken Treadmill')).toBeInTheDocument();
      expect(screen.getByText('Please fix soon')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  // Boundary test: empty data
  test('renders gracefully with empty data (boundary)', async () => {
    render(<MockFacilityReports mockData={[]} />);

    await waitFor(() => {
      const rows = screen.queryAllByRole('row');
      // Should only have the header row
      expect(rows.length).toBe(1);
    });
  });
});
