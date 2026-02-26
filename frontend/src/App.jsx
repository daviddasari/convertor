import { useState } from 'react';
import axios from 'axios';
import './App.css';

// --- ICONS ---
const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="brand-icon">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
  </svg>
);

const ConvertIcon = () => (
  <svg className="main-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
    <polyline points="13 2 13 9 20 9"></polyline>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

// --- STEPS DATA ---
const steps = [
  { num: 1, title: 'Upload', desc: 'Select the Word or PowerPoint file you wish to convert.' },
  { num: 2, title: 'Convert', desc: 'Our free PDF creator will convert your document to PDF in seconds.' },
  { num: 3, title: 'Download', desc: 'Your new document will be ready to download immediately.' }
];

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setDownloadUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      // LIVE Backend URL
      const BACKEND_URL = 'https://convertor-serm.onrender.com'; 
      const response = await axios.post(`${BACKEND_URL}/convert/office-to-pdf`, formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="brand">
          <LogoIcon />
          <span>EFN Pdf Converter</span>
        </div>
      </nav>

      {/* Main Content Area - Flexbox Centered */}
      <div className="hero-container">
        <div className="card">
          
          {/* Header Area */}
          <div className="icon-header">
            <ConvertIcon />
          </div>
          <h1>EFN Pdf Converter</h1>
          <p className="subtitle">
            The easiest way to convert your documents to PDF format.
            <br/>Supported formats: <strong>.docx, .pptx</strong>
          </p>

          {/* --- ACTION AREA --- */}
          <div className="action-wrapper">
            
            {/* STATE 1: NO FILE (Show Select Button with Overlay Input) */}
            {!file && (
              <div className="upload-wrapper">
                <input 
                  type="file" 
                  className="hidden-input" 
                  onChange={handleFileChange} 
                  accept=".docx,.pptx,.doc,.ppt" 
                />
                <button className="btn-upload">
                  <UploadIcon /> Select PDF file
                </button>
              </div>
            )}

            {/* STATE 2: FILE SELECTED (Show Convert Button - NO Overlay) */}
            {file && status !== 'success' && (
              <div className="file-selected-area">
                <div className="file-info-badge">
                  <FileIcon /> {file.name}
                  {/* Small Change Link */}
                  <div className="change-file-link">
                    Change
                    <input 
                      type="file" 
                      className="hidden-input-small" 
                      onChange={handleFileChange} 
                      accept=".docx,.pptx,.doc,.ppt" 
                    />
                  </div>
                </div>

                <button 
                  className="btn-convert" 
                  onClick={handleUpload}
                  disabled={status === 'uploading'}
                >
                  {status === 'uploading' ? (
                    <span className="flex-center"><div className="loader"></div> Converting...</span>
                  ) : (
                    "Convert to PDF ➜"
                  )}
                </button>
              </div>
            )}

            {/* STATE 3: SUCCESS */}
            {status === 'success' && (
              <div className="success-area">
                <h3>🎉 Success!</h3>
                <a href={downloadUrl} download={`converted-${file.name}.pdf`} className="btn-download">
                  <DownloadIcon /> Download PDF
                </a>
                <button className="btn-reset" onClick={() => { setFile(null); setStatus('idle'); }}>
                  Convert another file
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {status === 'error' && (
            <p className="error-msg">❌ Error converting file. Please try again.</p>
          )}
        </div>
      </div>

      {/* Footer Steps */}
      <div className="steps-section">
        <h2>How to Convert Files to and from PDF Free</h2>
        <div className="steps-grid">
          {steps.map((s) => (
            <div key={s.num} className="step">
              <div className="step-circle">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Easter Egg */}
      <button
        className="easter-egg-btn"
        onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
      >
        Click here
      </button>
    </div>
  );
}

export default App;