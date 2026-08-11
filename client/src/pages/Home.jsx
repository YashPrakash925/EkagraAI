import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjectMeta, fetchChanges, fetchPPT } from '../services/api';
import VersionCard from '../components/VersionCard';
import TechStackBadges from '../components/TechStackBadges';
import ChangeLog from '../components/ChangeLog';
import ChangeForm from '../components/ChangeForm';

export default function Home({ adminUser }) {
  const [project, setProject] = useState(null);
  const [changes, setChanges] = useState([]);
  const [pptMeta, setPptMeta] = useState(null);
  const [available, setAvailable] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [projRes, changeRes, pptRes] = await Promise.all([
        fetchProjectMeta(),
        fetchChanges(),
        fetchPPT()
      ]);

      if (projRes.success) setProject(projRes.project);
      if (changeRes.success) setChanges(changeRes.changes);

      if (pptRes && pptRes.available) {
        setAvailable(true);
        setPptMeta(pptRes);
      } else {
        setAvailable(false);
        setPptMeta(null);
      }
    } catch (err) {
      console.error('Error loading home data:', err);
      setAvailable(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddChangeSuccess = (newChange) => {
    setChanges((prev) => [newChange, ...prev]);
  };

  const handleDeleteChangeSuccess = (id) => {
    setChanges((prev) => prev.filter((item) => item.id !== id));
  };

  const handleViewPPT = () => {
    navigate('/ppt-viewer');
  };

  const isAdmin = adminUser && adminUser.role === 'admin';

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-grid">
        <div>
          <div className="course-tag">
            {project?.courseLabel || 'UCS503 Software Engineering'}
          </div>
          
          {/* Brand Title with Sanskrit Etymology */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 className="brand-title-main" style={{ margin: 0 }}>
              EkagraAI
            </h1>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '0.2rem 0.55rem', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              ekāgra (एकाग्र): One-Pointed Concentration
            </span>
          </div>

          <div className="page-subtitle" style={{ marginTop: '0.4rem' }}>
            Webcam-Based Psychophysiological Focus Tracker
          </div>

          <p className="page-desc" style={{ fontSize: '0.94rem', lineHeight: '1.65' }}>
            EkagraAI is a webcam-based focus tracker that solves a problem every existing productivity tool gets wrong: treating all "eyes off screen" moments as distraction. Named after <em>ekāgra</em> (एकाग्र), the Sanskrit term for one-pointed concentration, it fuses gaze, blink, pupil dilation, and heart-rate variability to distinguish genuine attentional lapses from reflective, eyes-closed thinking — a distinction grounded in established psychophysiology rather than a guess. The system learns this distinction from real labeled sessions (self-reported ground truth via NASA-TLX and a manual "Thinking Mode" toggle), not a pretrained model, since no existing tool solves this specific problem. At the end of a session, it summarizes what actually happened using an LLM grounded strictly in the user's own measured data, alongside a gamified streak/points layer to keep it motivating without misrepresenting what "focus" really looked like.
          </p>

          <TechStackBadges stack={['Gaze Tracking', 'Pupil Dilation', 'HRV Biometrics', 'Thinking Mode AI', 'LLM Analytics']} />
        </div>

        {/* Compact Version Box */}
        <VersionCard
          uploadedDate={project?.uploadedDate || '10 August 2026'}
          version={project?.version || 'V1'}
        />
      </div>

      {/* Presentation Action Bar: Shown ONLY when available: true */}
      {available && pptMeta && (
        <div className="flat-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', borderColor: '#333333', backgroundColor: '#0d0d0d', marginBottom: '2.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#ffffff', margin: '0 0 0.25rem 0' }}>
              {pptMeta.presentationName || 'Project Presentation PDF'}
            </h3>
            <div style={{ color: '#a3a3a3', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
              Version: {pptMeta.version || 'V1'} • Uploaded by {pptMeta.uploadedBy || 'Admin'} on {pptMeta.uploadedAt}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleViewPPT} className="btn-solid">
              View Presentation PDF
            </button>
          </div>
        </div>
      )}

      {/* Target Users Section */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '1rem' }}>Target Users</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div className="flat-panel" style={{ margin: 0, padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.3rem' }}>School Students</h3>
            <p style={{ fontSize: '0.85rem', color: '#a3a3a3', lineHeight: 1.4 }}>
              Maintains concentration during online learning, reducing distraction from digital devices.
            </p>
          </div>

          <div className="flat-panel" style={{ margin: 0, padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.3rem' }}>College Students</h3>
            <p style={{ fontSize: '0.85rem', color: '#a3a3a3', lineHeight: 1.4 }}>
              Supports deep work sessions, coding assignments, and long study hours with real-time feedback.
            </p>
          </div>

          <div className="flat-panel" style={{ margin: 0, padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.3rem' }}>Exam Candidates</h3>
            <p style={{ fontSize: '0.85rem', color: '#a3a3a3', lineHeight: 1.4 }}>
              Designed for high-intensity competitive exam preparation with physiological strain tracking.
            </p>
          </div>

          <div className="flat-panel" style={{ margin: 0, padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.3rem' }}>Working Professionals</h3>
            <p style={{ fontSize: '0.85rem', color: '#a3a3a3', lineHeight: 1.4 }}>
              Optimizes engineering workflows and deep focus without penalty for reflective thinking time.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '1rem' }}>Core System Features</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div className="flat-panel" style={{ margin: 0, padding: '1.25rem' }}>
            <div style={{ color: '#38bdf8', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Head & Eye Movement Detection
            </div>
            <p style={{ fontSize: '0.85rem', color: '#a3a3a3', lineHeight: 1.4 }}>
              Webcam-based real-time tracking of head tilt, eye direction, and gaze vectors.
            </p>
          </div>

          <div className="flat-panel" style={{ margin: 0, padding: '1.25rem' }}>
            <div style={{ color: '#38bdf8', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Session Productivity Graphs
            </div>
            <p style={{ fontSize: '0.85rem', color: '#a3a3a3', lineHeight: 1.4 }}>
              Real-time graphs plotting focus levels, velocity curves, and cognitive engagement.
            </p>
          </div>

          <div className="flat-panel" style={{ margin: 0, padding: '1.25rem' }}>
            <div style={{ color: '#38bdf8', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Pupil Dilation & HRV Metrics
            </div>
            <p style={{ fontSize: '0.85rem', color: '#a3a3a3', lineHeight: 1.4 }}>
              Biometric analysis of pupil dilation and heart-rate variability for strain measurement.
            </p>
          </div>

          <div className="flat-panel" style={{ margin: 0, padding: '1.25rem' }}>
            <div style={{ color: '#38bdf8', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Device Distraction Counter
            </div>
            <p style={{ fontSize: '0.85rem', color: '#a3a3a3', lineHeight: 1.4 }}>
              Automated detection of secondary devices (smartphones, tablets) counting as distractions.
            </p>
          </div>

          <div className="flat-panel" style={{ margin: 0, padding: '1.25rem' }}>
            <div style={{ color: '#38bdf8', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Daily Login Points
            </div>
            <p style={{ fontSize: '0.85rem', color: '#a3a3a3', lineHeight: 1.4 }}>
              Gamified reward structure earning daily points for consistent study habits.
            </p>
          </div>

          <div className="flat-panel" style={{ margin: 0, padding: '1.25rem' }}>
            <div style={{ color: '#38bdf8', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Streaks & Social Comparison
            </div>
            <p style={{ fontSize: '0.85rem', color: '#a3a3a3', lineHeight: 1.4 }}>
              Maintain daily study streaks and benchmark your focus metrics against friends.
            </p>
          </div>

          <div className="flat-panel" style={{ margin: 0, padding: '1.25rem' }}>
            <div style={{ color: '#38bdf8', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Embedded LLM Doubt Assistant
            </div>
            <p style={{ fontSize: '0.85rem', color: '#a3a3a3', lineHeight: 1.4 }}>
              In-session AI assistant to resolve doubts instantly without breaking workflow or switching tabs.
            </p>
          </div>

          <div className="flat-panel" style={{ margin: 0, padding: '1.25rem' }}>
            <div style={{ color: '#38bdf8', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Thinking Mode (Eyes-Closed Focus)
            </div>
            <p style={{ fontSize: '0.85rem', color: '#a3a3a3', lineHeight: 1.4 }}>
              Enables reflective eyes-closed thinking without penalizing focus scores or productivity.
            </p>
          </div>
        </div>
      </section>

      {/* Admin Add Change Form */}
      {isAdmin && (
        <ChangeForm defaultAuthor={adminUser.name} onChangeAdded={handleAddChangeSuccess} />
      )}

      {/* Change Log Section */}
      <ChangeLog changes={changes} isAdmin={isAdmin} onDeleteChange={handleDeleteChangeSuccess} />
    </div>
  );
}
