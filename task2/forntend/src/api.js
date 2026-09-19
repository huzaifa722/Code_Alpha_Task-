const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  getProfile: (token) => request('/auth/me', { token }),

  getEvents: (query = '') => request(`/events${query}`),
  getEvent: (id) => request(`/events/${id}`),
  createEvent: (payload, token) => request('/events', { method: 'POST', body: payload, token }),

  registerForEvent: (eventId, token) =>
    request('/registrations', { method: 'POST', body: { eventId }, token }),
  getMyRegistrations: (token) => request('/registrations/me', { token }),
  cancelRegistration: (id, token) => request(`/registrations/${id}`, { method: 'DELETE', token }),
};
