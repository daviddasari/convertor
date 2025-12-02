import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [downloadUrl, setDownloadUrl] = useState(null);

  // 1. Handle File Selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');     // Reset status on new file
      setDownloadUrl(null);  // Reset previous download
    }
  };

  // 2. Handle the Conversion
  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Your LIVE Render Backend URL
      const BACKEND_URL = 'https://convertor-serm.onrender.com'; 
      
      const response = await axios.post(`${BACKEND_URL}/convert/office-to-pdf`, formData, {
        responseType: 'blob', // Important: response is a file, not JSON
      });

      // Create a temporary URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
      setStatus('success');
      
    } catch (error) {
      console.error("Conversion failed:", error);
      setStatus('error');
    }
  };

  return (
    <div className="container">
      
      <div className="header">
        <h1>Office to PDF Converter</h1>
        <p className="subtitle">
          Convert your Word (.docx) and PowerPoint (.pptx) documents to PDF instantly.
        </p>
      </div>

      <div className="upload-area">
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".docx,.pptx,.doc,.ppt" 
        />
        <div className="upload-placeholder">
          <span className="upload-icon">📄</span>
          <p>
            {!file ? "Click to Select File" : ""}
          </p>
          {file && <div className="file-name">Selected: {file.name}</div>}
        </div>
      </div>

      {/* Convert Button */}
      {file && status !== 'success' && (
        <button 
          className="convert-btn" 
          onClick={handleUpload} 
          disabled={status === 'uploading'}
        >
          {status === 'uploading' ? (
            <span><div className="loader"></div> Converting...</span>
          ) : (
            "Convert to PDF"
          )}
        </button>
      )}

      {/* Success & Download */}
      {status === 'success' && (
        <div className="success-message">
          <h3>🎉 Ready to Download!</h3>
          <a 
            href={downloadUrl} 
            download={`converted-${file.name}.pdf`} 
            className="download-link"
          >
            Download PDF
          </a>
          <br/><br/>
          <button 
            className="text-muted" 
            onClick={() => { setFile(null); setStatus('idle'); }}
            style={{background: 'none', border: 'none', cursor: 'pointer', color: '#666', textDecoration: 'underline'}}
          >
            Convert another file
          </button>
        </div>
      )}

      {/* Error Message */}
      {status === 'error' && (
        <p style={{color: 'red', marginTop: '20px'}}>
          ❌ Oops! Conversion failed. Please try again.
        </p>
      )}

    </div>
  );
}

export default App;