import { Link } from 'react-router-dom';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function EventCard({ event }) {
  const d = new Date(event.date);
  const spotsLeft = event.capacity - event.registeredCount;
  const isFull = spotsLeft <= 0;

  return (
    <Link to={`/events/${event._id}`} className="ticket">
      <div className="ticket-main">
        <h3 className="ticket-title">{event.title}</h3>
        <div className="ticket-meta">
          <span>{event.venue}</span>
          {event.time && <span>{event.time}</span>}
          {event.category && <span>{event.category}</span>}
        </div>
        <p className="ticket-desc">{event.description}</p>
      </div>
      <div className="ticket-stub">
        <div className="day">{d.getDate()}</div>
        <div className="month">{MONTHS[d.getMonth()]} {d.getFullYear()}</div>
        <span className={`capacity ${isFull ? 'full' : 'open'}`}>
          {isFull ? 'Full' : `${spotsLeft} spots left`}
        </span>
      </div>
    </Link>
  );
}
