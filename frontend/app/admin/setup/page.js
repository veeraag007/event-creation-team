// Opens the setup wizard for first-time admins and restores completed workspaces.
'use client';
import {useEffect,useState} from 'react';
import {accountRequest} from '../../attendee/api';
import OrganizationWizard from './OrganizationWizard';
import s from './workspace.module.css';
export default function Setup(){
 const [admin,setAdmin]=useState(null),[open,setOpen]=useState(false),[error,setError]=useState('');
 useEffect(()=>{Promise.all([accountRequest('admin','/me'),accountRequest('admin','/organization')]).then(([profile,workspace])=>{
 if(workspace.configured)location.replace('/admin/dashboard');else setAdmin(profile);
 }).catch(e=>{if(e.status===401)location.replace('/admin-login');else setError(e.message);});},[]);
 return <div className={s.shell}><header><b>Community 360</b><small>Organizer workspace</small></header><main>{error && <p role="alert">{error}</p>}{admin?<section className={s.panel}><small>Welcome, {admin.fullName}</small><h1>Create your organization workspace</h1><p>Set up your venues and seating, choose event and ticketing modules, and track registrations from your dashboard.</p><button onClick={()=>setOpen(true)}>Setup My Organization</button></section>:!error&&<p>Loading workspace…</p>}{open&&<OrganizationWizard admin={admin} close={()=>setOpen(false)} launched={()=>location.replace('/admin/dashboard')}/>}</main></div>;
}
