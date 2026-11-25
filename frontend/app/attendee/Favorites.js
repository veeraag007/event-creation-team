// Loads the signed-in attendee's wishlist once per workspace and persists heart actions.
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { attendeeRequest } from './api';
import Icon from './Icon';
import s from './account.module.css';

const Favorites = createContext(null);
export const useFavorites = () => useContext(Favorites);

export function FavoritesProvider({ children }) {
  const [ids, setIds] = useState(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState([]);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    attendeeRequest('/wishlist').then(data => { if (active) setIds(data); })
      .catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [attempt]);
  async function toggle(id) {
    const saved = ids.includes(id);
    setPending(current => [...current,id]);
    setError('');
    try {
      await attendeeRequest('/wishlist/' + encodeURIComponent(id), saved ? 'DELETE' : 'PUT', saved ? undefined : {});
      setIds(current => saved ? current.filter(item => item !== id) : [...new Set([...current,id])]);
    } catch (e) { setError(e.message); }
    finally { setPending(current => current.filter(item => item !== id)); }
  }
  return <Favorites.Provider value={{ ids, pending, toggle }}>
    {error && <p role="alert" className={s.error}>Wishlist: {error} {!ids && <button onClick={() => { setError(''); setAttempt(n => n + 1); }}>Retry</button>}</p>}
    {children}
  </Favorites.Provider>;
}
export function Heart({ event }) {
  const { ids, pending, toggle } = useFavorites();
  const saved = ids?.includes(event.id) || false;
  const label = (saved ? 'Remove from wishlist' : 'Add to wishlist') + ' · ' + event.title;
  return <button className={s.iconBtn} type="button" title={label} aria-label={label} aria-pressed={saved} disabled={!ids || pending.includes(event.id)} onClick={() => toggle(event.id)}><Icon name="heart" filled={saved}/></button>;
}
