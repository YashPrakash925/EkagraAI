import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPPT } from '../services/api';

export default function PPTViewPage() {
  const [pptMeta, setPptMeta] = useState(null);
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('');
  const [presentations, setPresentations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPPT() {
      try {
        const res = await fetchPPT();
        if (res && res.available) {
          setAvailable(true);
          setPptMeta(res);
          setSelectedPdfUrl(res.pdfUrl);
          if (res.presentations && res.presentations.length > 0) {
            setPresentations(res.presentations);
          }
        } else {
          setAvailable(false);
        }
      } catch (err) {
        console.error('Error fetching PDF presentation:', err);
        setAvailable(false);
      } finally {
        setLoading(false);
      }
    }
    loadPPT();
  }, []);

  if (loading) {
    return (
      <div style={{ height: '400px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0d0d0d', color: '#ffffff', borderRadius: '8px', border: '1px solid #222222' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Loading Presentation PDF...</div>
        </div>
      </div>
    );
  }

  if (!available || !selectedPdfUrl) {
    return (
      <div style={{ height: '450px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0d0d0d', color: '#ffffff', borderRadius: '8px', border: '1px solid #222222', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📄</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ffffff' }}>No Presentation Available</h2>
          <p style={{ color: '#a3a3a3', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            No converted PDF presentation file is available right now. Please upload a PowerPoint file from the admin dashboard.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{ backgroundColor: '#ffffff', color: '#000000', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            ← Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const fullPdfUrl = selectedPdfUrl.startsWith('http') ? selectedPdfUrl : `${window.location.origin}${selectedPdfUrl}`;

  return (
    <div style={{ height: 'calc(100vh - 120px)', maxHeight: '820px', width: '100%', maxWidth: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#000000', borderRadius: '8px', border: '1px solid #222222', overflow: 'hidden', boxSizing: 'border-box' }}>
      
      {/* TOP PRESENTATION BAR */}
      <div style={{ padding: '0.6rem 1.25rem', backgroundColor: '#0d0d0d', borderBottom: '1px solid #222222', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{ backgroundColor: 'transparent', color: '#ffffff', border: '1px solid #404040', borderRadius: '4px', padding: '0.35rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
          >
            ← Back to Homepage
          </button>
          
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              {pptMeta?.presentationName || 'PowerPoint Presentation PDF'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              Version: {pptMeta?.version || 'V1'} • Converted PDF Presentation
            </div>
          </div>

          {/* Multiple Version / Presentation Dropdown */}
          {presentations.length > 1 && (
            <select
              value={selectedPdfUrl}
              onChange={(e) => setSelectedPdfUrl(e.target.value)}
              style={{ backgroundColor: '#141414', color: '#38bdf8', border: '1px solid #3b82f6', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              {presentations.map((p, idx) => (
                <option key={idx} value={p.pdfUrl}>
                  {p.version} - {p.presentationName}
                </option>
              ))}
            </select>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <a
            href={fullPdfUrl}
            download
            style={{ backgroundColor: '#ef4444', color: '#ffffff', textDecoration: 'none', padding: '0.35rem 0.85rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            📥 Download PDF
          </a>
        </div>
      </div>

      {/* EMBEDDED PDF VIEWER CANVAS */}
      <div style={{ flex: 1, width: '100%', height: '100%', backgroundColor: '#0a0a0a', overflow: 'hidden', position: 'relative' }}>
        <object
          data={fullPdfUrl}
          type="application/pdf"
          style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', border: 'none', display: 'block' }}
        >
          <iframe
            src={fullPdfUrl}
            style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', border: 'none', display: 'block' }}
            title="PPT Presentation PDF Viewer"
          />
        </object>
      </div>

    </div>
  );
}