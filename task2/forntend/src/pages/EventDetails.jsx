import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function EventDetails() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registering, setRegistering] = useState(false);

  const loadEvent = () => {
    setLoading(true);
    api
      .getEvent(id)
      .then((data) => setEvent(data.event))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadEvent, [id]);

  const handleRegister = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setError('');
    setSuccess('');
    setRegistering(true);
    try {
      await api.registerForEvent(id, token);
      setSuccess("You're registered! Check My registrations to manage it.");
      loadEvent();
    } catch (err) {
      setError(err.message);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="container"><p className="loading-text">Loading event…</p></div>;
  if (!event) return <div className="container"><p>Event not found.</p></div>;

  const d = new Date(event.date);
  const spotsLeft = event.capacity - event.registeredCount;
  const isFull = spotsLeft <= 0;

  return (
    <div className="container">
      <Link to="/">&larr; Back to events</Link>

      <div className="detail-header" style={{ marginTop: '1rem' }}>
        <h1>{event.title}</h1>
        <p>{event.description}</p>
        <div className="detail-meta-row">
          <div>
            <strong>{d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
            {event.time || 'Time TBA'}
          </div>
          <div>
            <strong>Venue</strong>
            {event.venue}
          </div>
          <div>
            <strong>Capacity</strong>
            {event.registeredCount} / {event.capacity} registered
          </div>
          {event.organizer?.name && (
            <div>
              <strong>Organized by</strong>
              {event.organizer.name}
            </div>
          )}
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      {user?.role === 'organizer' || user?.role === 'admin' ? (
        <p className="loading-text">Organizers view event details but register as a participant to attend.</p>
      ) : (
        <button className="btn" onClick={handleRegister} disabled={isFull || registering}>
          {isFull ? 'Event full' : registering ? 'Registering…' : 'Register for this event'}
        </button>
      )}
    </div>
  );
}
