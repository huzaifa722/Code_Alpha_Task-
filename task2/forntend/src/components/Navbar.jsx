import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Campus<span className="brand-dot">Events</span>
        </Link>
        <nav className="nav-links">
          <Link to="/">Browse</Link>
          {user && <Link to="/my-registrations">My registrations</Link>}
          {user ? (
            <>
              <span>{user.name}</span>
              <button onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register" className="nav-cta">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
