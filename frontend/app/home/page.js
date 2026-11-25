// Presents the signed-in attendee home with live discovery sections, categories and cities.
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFavorites } from '../attendee/Favorites';
import Workspace from '../attendee/Workspace';
import { useEventFeed, EventTiles } from '../attendee/EventFeed';
import { attendeeRequest } from '../attendee/api';
import { homeSections } from '../attendee/homeSections.mjs';
import Icon from '../attendee/Icon';
import s from '../attendee/account.module.css';

const categories = ['Sports','Concerts','Live shows','Music','Comedy shows'];
function HomeContent({ profile }) {
  const { events, error, retry } = useEventFeed();
  const { ids } = useFavorites();
  const [ranking, setRanking] = useState(null);
  const [rankError, setRankError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let active = true;
    attendeeRequest('/top-events').then(data => { if (active) setRanking(data); })
      .catch(e => { if (active) setRankError(e.message); });
    const timer = setInterval(() => setNow(new Date()),60000);
    return () => { active = false; clearInterval(timer); };
  }, [attempt, ids]);
  const groups = homeSections(events || [], ranking || [], now);
  const labels = new Map(categories.map(value => [value.toLowerCase(), value]));
  for (const event of events || []) if (event.category) labels.set(event.category.toLowerCase(), event.category);
  const cities = [...new Set([profile.location, ...(events || []).map(e => e.city)].filter(Boolean))].sort();
  return <>
    <div className={s.hero}>
      <div><p className={s.heroLabel}>Community 360 / Attendee home</p><h1>Find your next<br/>live experience.</h1>
      <Link className={s.heroLink} href="/explore">Explore events <span aria-hidden="true">↗</span></Link></div>
      <div className={s.sound} aria-hidden="true">{Array.from({ length: 40 }, (_, i) =>
        <i key={i} style={{ height: (18 + Math.abs(Math.sin(i * .21) * Math.cos(i * .49)) * 82) + '%', animationDelay: i * -.13 + 's' }}/>)}</div>
    </div>
    <section className={s.strip}><h2>Categories</h2><div className={s.chips}>{[...labels.values()].map(category =>
      <Link key={category} href={'/explore?category=' + encodeURIComponent(category)}>{category}</Link>)}</div></section>
    {error ? <p role="alert" className={s.panel}>Could not load published events. <button className={s.textButton} onClick={retry}>Retry</button></p>
      : !events ? <p role="status">Loading events…</p> : <>
      {[[ 'Featured events','featured','Newly published events will appear here.' ],
        [ 'Today’s live events','live','No events are live right now.' ],
        [ 'Events this week','week','No events are scheduled for the rest of this week.' ],
        [ 'Top events','top','The events attendees save most will appear here.' ]].map(([title,key,empty]) =>
        <section className={s.strip} key={key}><h2>{title}</h2>
          {key === 'top' && rankError ? <p role="alert">Could not load top events. <button className={s.textButton} onClick={() => { setRankError(''); setAttempt(n => n + 1); }}>Retry</button></p> : key === 'top' && !ranking ? <p role="status">Loading top events…</p> : <EventTiles events={groups[key]} empty={empty}/>}
        </section>)}</>}
    <section className={s.strip}><h2>Locations</h2>
      {cities.length ? <div className={s.chips}>{cities.map(city => <Link key={city} href={'/explore?city=' + encodeURIComponent(city)}><Icon name="pin"/>{city}</Link>)}</div> :
        <p className={s.quiet}>Browse by city as events are published, or <Link className={s.link} href="/profile#location">add your location</Link>.</p>}
    </section>
  </>;
}
export default function Home() { return <Workspace>{profile => <HomeContent profile={profile}/>}</Workspace>; }
