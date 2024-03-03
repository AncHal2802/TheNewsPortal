import React, { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import axios from 'axios';

const PdfViewer = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const fetchPdfFiles = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/get-receipts');
        setPdfFiles(response.data);
      } catch (error) {
        console.error('Error fetching PDF files:', error);
      }
    };

    fetchPdfFiles();
  }, []);

  const handlePdfSelection = (pdf) => {
    setSelectedPdf(pdf);
  };

  return (
    <div>
      <h2>PDF Viewer</h2>
      <div className="pdf-list">
        {pdfFiles.map((pdf, index) => (
          <div key={index} className="pdf-item" onClick={() => handlePdfSelection(pdf)}>
            {pdf}
          </div>
        ))}
      </div>
      {selectedPdf && (
        <div>
          <h3>Selected PDF: {selectedPdf}</h3>
          {/* Use the Worker and Viewer components from react-pdf-viewer */}
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
            <Viewer fileUrl={`http://localhost:3000/api/get-receipts/${selectedPdf}`} />
          </Worker>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
