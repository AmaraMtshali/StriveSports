import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardSwitcher from '../adminResources/adminProps/DashboardSwitcher';

global.fetch = jest.fn();

const defaultDashboards = {
  maintenance: 'https://charts.mongodb.com/charts-project-0-hqkmgki/embed/dashboards?id=680810f8-19dd-4115-84d0-1a597dcd4c43&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=scale&scalingHeight=scale',
  booking: 'https://charts.mongodb.com/charts-project-0-hqkmgki/embed/dashboards?id=d7683d19-69a9-415c-bb7b-3b7f97a53ac1&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=scale&scalingHeight=scale',
};

function renderWithDashboards(dashboards = defaultDashboards) {
  return render(<DashboardSwitcher dashboards={dashboards} />);
}

describe('DashboardSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Equivalence Test:
  // Tests normal expected state: initial dashboard is "maintenance"
  test('renders with initial maintenance dashboard iframe', () => {
    renderWithDashboards();

    const iframe = screen.getByTitle(/maintenance dashboard/i);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', defaultDashboards.maintenance);
  });

  // Equivalence Test:
  // Tests switching between valid dashboard options ("maintenance" and "booking")
  test('switching dashboards updates iframe src correctly (equivalence)', () => {
    renderWithDashboards();

    fireEvent.click(screen.getByText(/Booking Dashboard/i));
    expect(screen.getByTitle(/booking dashboard/i)).toHaveAttribute('src', defaultDashboards.booking);

    // Switch back to maintenance dashboard
    fireEvent.click(screen.getByText(/Maintenance Dashboard/i));
    expect(screen.getByTitle(/maintenance dashboard/i)).toHaveAttribute('src', defaultDashboards.maintenance);
  });

  // Equivalence Test:
  // Tests clicking "Download PDF" triggers fetch call with correct URL for active dashboard
  test('download PDF triggers fetch with correct url and initiates download', async () => {
    const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });
    fetch.mockResolvedValueOnce({
        
      blob: () => Promise.resolve(mockBlob),
    });

    renderWithDashboards();
    fireEvent.click(screen.getByText(/Download as PDF/i));

    await waitFor(() => expect(fetch).toHaveBeenCalledWith('http://localhost:8080/download-dashboard/maintenance'));
  });

  // Equivalence Test:
  // Tests clicking "Download CSV" triggers fetch call with correct URL for active dashboard
  test('download CSV triggers fetch with correct url and initiates download', async () => {
    const mockBlob = new Blob(['CSV content'], { type: 'text/csv' });
    fetch.mockResolvedValueOnce({
      blob: () => Promise.resolve(mockBlob),
    });

    renderWithDashboards();

    fireEvent.click(screen.getByText(/Download CSV/i));

    await waitFor(() => expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/download-csv/maintenance'));
  });

  // Boundary Test:
  // Tests behavior when dashboards object is empty (edge case / boundary condition)
  // Verifies no iframe is rendered and buttons are still present (graceful handling)
  test('handles empty dashboards object gracefully (boundary)', () => {
    renderWithDashboards({});

    // There should be no iframe rendered because no URLs are available
    const iframe = screen.queryByRole('iframe');
    expect(iframe).toBeNull();

    // Buttons still exist so user can try to switch or trigger downloads (though URLs missing)
    expect(screen.getByText(/Maintenance Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Booking Dashboard/i)).toBeInTheDocument();
  });
});
