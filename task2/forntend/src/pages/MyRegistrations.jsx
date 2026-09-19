import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function MyRegistrations() {
  const { token } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .getMyRegistrations(token)
      .then((data) => setRegistrations(data.registrations))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const handleCancel = async (regId) => {
    setCancellingId(regId);
    setError('');
    try {
      await api.cancelRegistration(regId, token);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="container">
      <h1>My registrations</h1>
      <p>Everything you've signed up for, in one place.</p>

      {error && <div className="error-banner">{error}</div>}
      {loading && <p className="loading-text">Loading…</p>}

      {!loading && registrations.length === 0 && (
        <div className="empty-state">
          <p>You haven't registered for anything yet.</p>
          <Link to="/" className="btn" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Browse events
          </Link>
        </div>
      )}

      {!loading &&
        registrations.map((reg) => (
          <div className="reg-row" key={reg._id}>
            <div className="reg-info">
              <h3>{reg.event?.title || 'Event removed'}</h3>
              {reg.event && (
                <span>
                  {new Date(reg.event.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  · {reg.event.venue}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
              <span className={`status-pill ${reg.status}`}>{reg.status}</span>
              {reg.status === 'confirmed' && (
                <button
                  className="btn btn-danger"
                  onClick={() => handleCancel(reg._id)}
                  disabled={cancellingId === reg._id}
                >
                  {cancellingId === reg._id ? 'Cancelling…' : 'Cancel'}
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
