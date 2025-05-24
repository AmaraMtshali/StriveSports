{/*This file is concerned with handling the dashboard switching logic and displaying the charts that are supposed to be there. */}

import React, { useState } from 'react';
import "./DashboardSwitcher.css";
const DashboardSwitcher = () => {
  const [activeDashboard, setActiveDashboard] = useState('maintenance');


  //these are connected to the mongodb dashboards ,
  //As there are two dashboard implementations.
  const dashboards = {
    maintenance: {
      title: 'Maintenance Dashboard',
      url: `${import.meta.env.VITE_MAIN_DASH_URL}`
    },
    booking: {
      title: 'Booking Dashboard',
      url: `${import.meta.env.VITE_BOOK_DASH_URL}`
    }
  };


//logic to download csv files based on the current dashboard you are currently seeing
const handleDownloadCSV = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/download-csv/${activeDashboard}`);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDashboard}_data.csv`;
    document.body.appendChild(a); // Append for Firefox compatibility
    a.click();
    a.remove();
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
