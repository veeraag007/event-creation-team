// Renders the organization dashboard using the team ZIP's sidebar, overview and reporting layout.
'use client';
import { useCallback, useEffect, useState } from 'react';
import { accountRequest } from '../../attendee/api';
import Icon from '../../attendee/Icon';
import Operations from './Operations';
import s from './dashboard.module.css';

const navigation = [
  ['Dashboard','home'], ['Events','explore'], ['Attendees','person'],
  ['Registrations','tickets'], ['Calendar','pin'], ['Event performance','settings'],
  ['Organization','settings'],
];
const registrationStates = ['Confirmed','Pending','Cancelled'];

function EventList({ title, events }) {
  return <section className={s.panel}>
    <h2>{title}</h2>
    {events.length ? events.map(event => <div className={s.row} key={event.id}>
      <div><strong>{event.name}</strong><p>{event.start_date} · {event.venue || 'Venue pending'}</p></div>
      <span className={s.status}>{event.status}</span>
    </div>) : <p className={s.empty}>No events to display.</p>}
  </section>;
}

function Overview({ data, refresh, busy, error, navigate }) {
  const { events, members, stats, organization } = data;
  const cards = [
    ['Total events', events.length, 'Events created', 'explore'],
    ['Total attendees', members.length, 'Community members', 'person'],
    ['Registrations', stats.registrations, 'Total bookings', 'tickets'],
    ['Active events', events.filter(event => /^(active|ongoing|live)$/i.test(event.status)).length, 'Currently active', 'settings'],
  ];
  const upcoming = events.filter(event => event.status?.toLowerCase() === 'upcoming')
    .sort((first, second) => first.start_date.localeCompare(second.start_date)).slice(0, 4);
  return <>
    <section className={s.hero}>
      <div><p>{organization.sector} · {organization.city}</p><h1>Dashboard</h1>
        <p>Track events, attendees and registrations for {organization.name}.</p>
        {!error && <span className={s.connection}>Live organization data</span>}
      </div>
      <button type="button" onClick={refresh} disabled={busy}><span aria-hidden="true">↻</span> {busy ? 'Refreshing…' : 'Refresh data'}</button>
    </section>

    <section className={s.overview}>
      <h2>Overview statistics</h2>
      <div className={s.metrics}>{cards.map(([label, value, caption, icon]) => <article className={s.metric} key={label}>
        <span className={s.metricIcon}><Icon name={icon}/></span>
        <h3>{label}</h3><strong>{value}</strong><p>{caption}</p>
      </article>)}</div>
    </section>

    <section className={s.panel}>
      <h2>Registration statistics</h2>
      <div className={s.registrationGrid}>{registrationStates.map(state => <article key={state}>
        <h3>{state}</h3><strong>{stats[state.toLowerCase()]}</strong>
      </article>)}</div>
    </section>

    <section className={s.panel}>
      <h2>Quick actions</h2>
      <div className={s.actions}>
        <button onClick={() => navigate('Events')}>Create an event <span aria-hidden="true">↗</span></button>
        <button onClick={() => navigate('Attendees')}>Add an attendee <span aria-hidden="true">↗</span></button>
        <button onClick={() => navigate('Registrations')}>Manage registrations <span aria-hidden="true">↗</span></button>
      </div>
    </section>

    <div className={s.eventGrid}>
      <EventList title="Upcoming events" events={upcoming}/>
      <EventList title="Recent events" events={events.slice(0, 3)}/>
    </div>
  </>;
}

function Organization({ details }) {
  const entries = [
    ['Administrator', details.legalName], ['Role', details.role], ['Phone', details.phone],
    ['Members', details.members], ['Member scale', details.scale], ['Join policy', details.policy],
    ['Spaces', details.units], ['Default hall', details.hall || 'None selected'],
    ['Seating', details.seating], ['Plan', details.plan], ['Billing cycle', details.cycle],
    ['Enabled modules', details.modules.join(', ') || 'None selected'],
  ];
  return <section className={s.panel}>
    <h1>Organization details</h1>
    <dl className={s.details}>{entries.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
  </section>;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState('Dashboard');
  const load = useCallback(async () => {
    try {
      const result = await accountRequest('admin','/organization');
      if (!result.configured) location.replace('/admin/setup');
      else { setData(result); setError(''); }
    } catch (failure) {
      if (failure.status === 401) location.replace('/admin-login');
      else setError(failure.message);
    } finally { setBusy(false); }
  }, []);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => { if (active) load(); });
    return () => { active = false; };
  }, [load]);

  function refresh() { setBusy(true); load(); }
  async function logout() {
    try {
      await accountRequest('admin','/logout','POST',{});
      location.replace('/admin-login');
    } catch (failure) { setError(failure.message); }
  }

  return <div className={s.layout}>
    <aside className={s.sidebar}>
      <div className={s.brand}><span aria-hidden="true">C</span><div>Community 360<small>Admin portal</small></div></div>
      <nav aria-label="Admin workspace">
        {navigation.map(([label, icon]) => <button key={label} type="button" aria-current={view === label ? 'page' : undefined} onClick={() => setView(label)}>
          <Icon name={icon}/><span>{label}</span>
        </button>)}
      </nav>
    </aside>

    <div className={s.workspace}>
      <header className={s.topbar}>
        <div><strong>{data ? data.organization.name : 'Admin workspace'}</strong>
          {data && <p>{data.organization.legalName} · {data.organization.role}</p>}</div>
        <button type="button" onClick={logout}><Icon name="logout"/> Sign out</button>
      </header>
      <main className={s.content}>
        {error && <p className={s.error} role="alert">{error} <button onClick={refresh} disabled={busy}>Retry</button></p>}
        {!data && !error && <p role="status">Loading dashboard…</p>}
        {data && (view === 'Dashboard' ? <Overview data={data} refresh={refresh} busy={busy} error={error} navigate={setView}/>
          : view === 'Organization' ? <Organization details={data.organization}/>
            : <Operations key={view} view={view} data={data} update={setData}/>)}
      </main>
    </div>
  </div>;
}
