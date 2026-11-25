// Lists the signed-in attendee's saved published events and allows removal.
'use client';
import Workspace from '../attendee/Workspace';
import { useFavorites } from '../attendee/Favorites';
import { useEventFeed, EventTiles } from '../attendee/EventFeed';
import Link from 'next/link';
import s from '../attendee/account.module.css';

function Saved() {
  const { ids } = useFavorites();
  const { events, error, retry } = useEventFeed();
  if (ids?.length === 0) return <p className={s.quiet}>Tap a heart on an event to save it here. <Link className={s.link} href="/explore">Explore events</Link></p>;
  if (error) return <p role="alert">Could not load saved events. <button onClick={retry}>Retry</button></p>;
  if (!ids || !events) return <p role="status">Loading wishlist…</p>;
  return <EventTiles events={events.filter(e => ids.includes(e.id))} empty="Your saved events are currently unavailable."/>;
}
export default function Wishlist() { return <Workspace>{() => <><h1>Wishlist</h1><Saved/></>}</Workspace>; }
