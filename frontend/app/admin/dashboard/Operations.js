// Provides the team's events, calendar, attendees, performance and registration views within the current workspace.
'use client';
import {useState} from 'react';
import {accountRequest} from '../../attendee/api';
import s from './dashboard.module.css';
export default function Operations({data,update,view}){
 const [error,setError]=useState(''),[busy,setBusy]=useState(false);
 const [month,setMonth]=useState(()=>new Date().toISOString().slice(0,7));
 async function save(e){
   e.preventDefault();const form=e.currentTarget;const payload=Object.fromEntries(new FormData(form));
   const endpoint={Events:'events',Attendees:'members',Registrations:'registrations'}[view];
   setBusy(true);setError('');
   try{update(await accountRequest('admin','/organization/'+endpoint,'POST',payload));form.reset();}
   catch(e){setError(e.message);}finally{setBusy(false);}
 }
 const selection=(label,name,items)=><label>{label}<select name={name} required>{items.map(([id,text])=><option key={id} value={id}>{text}</option>)}</select></label>;
 const options=values=>values.map(v=>[v,v]);
 return <section className={s.panel}><h1>{view}</h1>{error&&<p role="alert">{error}</p>}
 {['Events','Attendees','Registrations'].includes(view)&&<form className={s.operations} key={view} onSubmit={save}>
 {view==='Events'&&<><label>Event name<input required maxLength={180} name="name"/></label><label>Start date<input type="date" required name="date"/></label><label>Venue<input maxLength={180} name="venue" defaultValue={data.organization.hall}/></label>{selection('Event status','status',options(['Upcoming','Active','Completed','Cancelled']))}</>}
 {view==='Attendees'&&<><label>Full name<input required name="name" maxLength={120}/></label><label>Email<input required type="email" name="email" maxLength={254}/></label></>}
 {view==='Registrations'&&<>{selection('Event','event',data.events.map(e=>[e.id,e.name]))}{selection('Attendee','member',data.members.map(e=>[e.id,e.name]))}{selection('Registration status','status',options(['Confirmed','Pending','Cancelled']))}</>}
 <button disabled={busy || (view==='Registrations'&&(!data.events.length||!data.members.length))}>{busy?'Saving…':'Save'}</button></form>}
 {view==='Calendar'&&<label>Month <input type="month" value={month} onChange={e=>setMonth(e.target.value)}/></label>}
 {view==='Attendees'&&data.members.map(m=><p key={m.id}>{m.name} · {m.email}</p>)}
 {view==='Registrations'&&data.bookings.map(b=><p key={b.id}>{b.event} · {b.attendee} · {b.status}</p>)}
 {['Events','Calendar','Event performance'].includes(view)&&data.events.filter(e=>view!=='Calendar'||e.start_date.startsWith(month)).map(e=><p key={e.id}>{e.name} · {e.start_date} · {view==='Event performance'?data.bookings.filter(b=>b.event_id===e.id).length+' registrations':e.status}</p>)}
 </section>;
}
