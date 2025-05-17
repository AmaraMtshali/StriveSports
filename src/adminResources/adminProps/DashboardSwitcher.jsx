//this is for adding the dashboard switcher for the admin to switch between the dashboards
//also theres a button for the admin to download the pdf of the dashboard.

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DashboardSwitcher = () => {
  const [activeDashboard, setActiveDashboard] = useState('maintenance');
  const iframeRef = useRef();

  const dashboards = {
    maintenance: 'https://charts.mongodb.com/charts-project-0-hqkmgki/embed/dashboards?id=680810f8-19dd-4115-84d0-1a597dcd4c43&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=scale&scalingHeight=scale',
    booking: 'https://charts.mongodb.com/charts-project-0-hqkmgki/embed/dashboards?id=d7683d19-69a9-415c-bb7b-3b7f97a53ac1&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=scale&scalingHeight=scale'
  };

  // const handleDownloadPDF = async () => {
  //   const iframe = iframeRef.current;
  //   const canvas = await html2canvas(iframe);
  //   const imgData = canvas.toDataURL('image/png');
  //   const pdf = new jsPDF();
  //   const imgProps = pdf.getImageProperties(imgData);
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //   pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //   pdf.save(`${activeDashboard}_dashboard.pdf`);
  // };
  const handleDownloadPDF = async () => {
  try {
    const response = await fetch(`http://localhost:8080/download-dashboard/${activeDashboard}`);
    const blob = await response.blob();

    // Create download link
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

//csv download implementation
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
      <section style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveDashboard('maintenance')}>Maintenance Dashboard</button>
        <button onClick={() => setActiveDashboard('booking')}>Booking Dashboard</button>
        <button onClick={handleDownloadPDF}>Download as PDF</button>
        <button onClick={handleDownloadCSV}>Download CSV</button> {/* Add this line */}
      </section>

      <section ref={iframeRef} style={{ width: '100vw', height: '100vh' }}>
        <iframe
          title={`${activeDashboard} dashboard`}
          src={dashboards[activeDashboard]}
          style={{
            background: '#F1F5F4',
            border: 'none',
            borderRadius: '2px',
            boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
            width: '100%',
            height: '100%',
          }}
        />
      </section>
    </section>
  );
};

export default DashboardSwitcher;
