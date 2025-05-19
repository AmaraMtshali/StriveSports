import React, { useState } from 'react';
import "./DashboardSwitcher.css";
const DashboardSwitcher = () => {
  const [activeDashboard, setActiveDashboard] = useState('maintenance');

  const dashboards = {
    maintenance: {
      title: 'Maintenance Dashboard',
      url: 'https://charts.mongodb.com/charts-project-0-hqkmgki/embed/dashboards?id=680810f8-19dd-4115-84d0-1a597dcd4c43&theme=light&autoRefresh=true&maxDataAge=60&showTitleAndDesc=false&scalingWidth=fixed&scalingHeight=fixed'
    },
    booking: {
      title: 'Booking Dashboard',
      url: 'https://charts.mongodb.com/charts-project-0-hqkmgki/embed/dashboards?id=d7683d19-69a9-415c-bb7b-3b7f97a53ac1&theme=light&autoRefresh=true&maxDataAge=60&showTitleAndDesc=false&scalingWidth=fixed&scalingHeight=fixed'
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`http://localhost:8080/download-dashboard/${activeDashboard}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeDashboard}_dashboard.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/download-csv/${activeDashboard}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeDashboard}_data.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('CSV Download failed:', err);
    }
  };

  return (
    <section>
      <section style={{ marginBottom: '20px', marginLeft: '10px' }} className="dashboard-buttons">
        <button onClick={() => setActiveDashboard('maintenance')}>Maintenance Dashboard</button>
        <button onClick={() => setActiveDashboard('booking')}>Booking Dashboard</button>
        <button onClick={handleDownloadPDF}>Download as PDF</button>
        <button onClick={handleDownloadCSV}>Download CSV</button>
      </section>

      <section className="dashboard-container">
        <iframe
          title={dashboards[activeDashboard].title}
          src={dashboards[activeDashboard].url}
        />
      </section>
    </section>
  );
};

export default DashboardSwitcher;
