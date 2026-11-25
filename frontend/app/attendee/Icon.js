// Draws the accessible navigation and event action symbols used across attendee pages.
const paths = {
  home: 'm3 10 9-7 9 7v10H15v-6H9v6H3z',
  explore: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM16 8l-3 5-5 3 3-5z',
  tickets: 'M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4zM15 7v2m0 2v2m0 2v2',
  heart: 'M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 6l-1-1.2a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z',
  person: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 7 0 0 1 16 0v2',
  settings: 'M3 6h8m4 0h6M3 12h2m4 0h12M3 18h10m4 0h4M11 3v6M7 9v6m8 0v6',
  logout: 'M10 3H4v18h6m4-14 5 5-5 5m-6-5h11',
  edit: 'm4 16-1 5 5-1L20 8l-4-4zM14 6l4 4',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
};
export default function Icon({ name, filled = false }) {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill={filled ? 'currentColor' : 'none'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>;
}
