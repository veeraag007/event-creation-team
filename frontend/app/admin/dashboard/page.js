// Adapts Akshita's dashboard statistics, upcoming events and registration breakdown to the admin's workspace.
'use client';
import {useCallback,useEffect,useState} from 'react';
import {accountRequest} from '../../attendee/api';
import Operations from './Operations';
import s from '../setup/workspace.module.css';
export default function Dashboard(){
  const [data,setData]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  const load=useCallback(async()=>{

    try {
      const result=await accountRequest('admin','/organization');
      setError('');
      if(!result.configured)location.replace('/admin/setup');else setData(result);
    } catch(e){if(e.status===401)location.replace('/admin-login');else setError(e.message);}
    finally{setBusy(false);}
  },[]);
  useEffect(()=>{let active=true; Promise.resolve().then(()=>{if(active)load();}); return ()=>{active=false;};},[load]);
  async function logout(){try{await accountRequest('admin','/logout','POST',{});location.replace('/admin-login');}catch(e){setError(e.message);}}
  const events=data?.events || [];
  const org=data?.organization;
  const summary={total_events:events.length,total_attendees:data?.members.length,total_registrations:data?.stats.registrations,active_events:events.filter(e=>['active','ongoing','live'].includes(e.status.toLowerCase())).length};
  const stats = [
    {
      title: "Total Events",
      value: summary.total_events,
      description: "Events created",
    },
    {
      title: "Total Attendees",
      value: summary.total_attendees,
      description: "Community members",
    },
    {
      title: "Registrations",
      value: summary.total_registrations,
      description: "Total bookings",
    },
    {
      title: "Active Events",
      value: summary.active_events,
      description: "Currently active",
    },
  ];

  const upcomingEvents = events.filter(
    (event) => event.status?.toLowerCase() === "upcoming"
  );

  const recentEvents = events.slice(0, 3);


  function listing(title,rows){return <section className={s.panel}><h2>{title}</h2>{rows.length?rows.map(e=><p key={e.id}><strong>{e.name}</strong> · {e.start_date} · {e.venue || 'Venue pending'} · {e.status}</p>):<p>No events to display.</p>}</section>;}
  return <div className={s.shell}><header><b>Community 360</b><button onClick={logout}>Sign out</button></header><main>
    {error && <p role="alert">{error} <button onClick={()=>{setBusy(true);load();}}>Retry</button></p>}
    {!org ? !error&&<p>Loading dashboard…</p> : <><small>Organization dashboard</small><h1>{org.name}</h1><p>{org.sector} · {org.city} · {org.plan}</p>
    <button onClick={()=>{setBusy(true);load();}} disabled={busy}>{busy?'Refreshing…':'Refresh data'}</button>
    <div className={s.tiles}>{stats.map(stat=><article key={stat.title}><small>{stat.title}</small><strong>{stat.value}</strong>{stat.description}</article>)}</div>
    <section className={s.panel}><h2>Registration overview</h2><p>Confirmed · {data.stats.confirmed}　 Pending · {data.stats.pending}　 Cancelled · {data.stats.cancelled}</p></section>
    <Operations data={data} update={setData}/>{listing('Upcoming events',upcomingEvents)}{listing('Recent events',recentEvents)}
    <section className={s.panel}><h2>Organization details</h2><p>{org.legalName} · {org.role} · {org.phone}</p><p>{org.members} · {org.scale} · {org.policy}</p>
    <p>{org.units} · {org.hall || 'No default hall'} · {org.seating}</p><p>{org.plan} · {org.cycle}</p><p>Enabled modules · {org.modules.join(', ') || 'None selected'}</p></section></>}
    </main></div>;
}
