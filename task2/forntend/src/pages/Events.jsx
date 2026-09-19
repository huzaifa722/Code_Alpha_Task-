import { useEffect, useState } from 'react';
import { api } from '../api';
import EventCard from '../components/EventCard';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    const query = params.toString() ? `?${params.toString()}` : '';

    setLoading(true);
    const timeout = setTimeout(() => {
      api
        .getEvents(query)
        .then((data) => setEvents(data.events))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 250); // light debounce for the search field

    return () => clearTimeout(timeout);
  }, [search, category]);

  return (
    <div className="container">
      <h1>Upcoming events</h1>
      <p>Browse what's happening on campus and reserve your spot.</p>

      <div className="filters">
        <input
          type="text"
          placeholder="Search events by title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option value="Workshop">Workshop</option>
          <option value="Competition">Competition</option>
          <option value="Seminar">Seminar</option>
          <option value="Social">Social</option>
          <option value="Sports">Sports</option>
        </select>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {loading && <p className="loading-text">Loading events…</p>}

      {!loading && events.length === 0 && (
        <div className="empty-state">
          <p>No events match your search right now. Try a different keyword or check back later.</p>
        </div>
      )}

      {!loading && events.map((event) => <EventCard key={event._id} event={event} />)}
    </div>
  );
}
