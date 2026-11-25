// Collects organization settings in six steps and launches the signed-in admin's workspace.
'use client';
import {useEffect,useRef,useState} from 'react';
import {accountRequest} from '../../attendee/api';
import s from './workspace.module.css';

const sectors = {
  'Professional & Business':['Tenant','Teams & Tenants','Desk','Workstations & Pods'],
  'Education & Learning':['Student','Students & Faculty','Lab','Lecture Theatres & Labs'],
  'Residential & Local':['Resident','Residents & Homeowners','Block','Blocks & Towers'],
  'Customer & Brand':['Member','VIP Members & Advocates','Lounge','Experience Lounges'],
  'Interest & Hobby':['Creator','Creators','Studio','Workshop Studios'],
  'Sports & Fitness':['Athlete','Athletes & Coaches','Court','Courts & Arenas'],
  'Social & Networking':['Guest','Members & Guests','Room','Meeting Rooms'],
  'Nonprofit':['Volunteer','Volunteers & Donors','Centre','Community Centres']
};
const steps = ['Admin identity','Sector','Organization details','Modules & spaces','Subscription','Launch'];
const modules = ['Auditoriums & Seating Tiers','Amenity & Space Reservations','Events & Ticketing','Financial Ledgers & Collections','Automated Tax Invoices & Statements','Polls & Democratic Voting','Volunteer Stewardship','Dining & Food Programs','Announcements & Broadcasts','Compliance Reports & Analytics'];
const plans = ['Starter Community','Growth & Professional','Enterprise & Campus'];
const slugify = value => value.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,80).replace(/^-|-$/g,'');
export default function OrganizationWizard({admin,close,launched}) {
  const dialog = useRef(null);
  const [step,setStep] = useState(0);
  const [password,setPassword] = useState('');
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const [data,setData] = useState({legalName:admin.fullName,phone:'',role:'',sector:Object.keys(sectors)[0],name:admin.organization,slug:slugify(admin.organization),city:'',scale:'Up to 250',policy:'Admin approval',member:'Tenant',members:'Teams & Tenants',unit:'Desk',units:'Workstations & Pods',modules:[modules[0],modules[2]],hall:'',seating:'Stalls and balcony',plan:plans[0],cycle:'Annual'});
  useEffect(()=>{const el=dialog.current; el.showModal(); return ()=>el.close();},[]);
  function change(key,value){setData(prev=>({...prev,[key]:value}));}
  function field(key,label,max,props={}){return <label>{label}<input required maxLength={max} value={data[key]} onChange={e=>change(key,e.target.value)} {...props}/></label>;}
  function select(key,label,options){return <label>{label}<select value={data[key]} onChange={e=>change(key,e.target.value)}>{options.map(x=><option key={x}>{x}</option>)}</select></label>;}
  async function submit(e){
    e.preventDefault();
    if(step<5){setStep(step+1);return;}
    setBusy(true);setError('');
    try {await accountRequest('admin','/organization','POST',{configuration:data,password});launched();}
    catch(e){if(e.status===401)location.replace('/admin-login');else {setError(e.message);if(e.status===409)setStep(2);if(e.message.includes('password'))setStep(0);}setBusy(false);}
  }
  return <dialog ref={dialog} className={s.dialog} aria-labelledby="setup-title" onCancel={e=>{e.preventDefault();if(!busy)close();}}>
    <header><div><small>Community 360</small><h2 id="setup-title">Organization setup</h2></div><button type="button" disabled={busy} aria-label="Close setup" onClick={close}>×</button></header>
    <ol>{steps.map((label,i)=><li key={label} aria-current={i===step?'step':undefined}>{i+1}. {label}</li>)}</ol>
    <form onSubmit={submit}><div className={s.body}><section key={step}><small>Step {step+1} of 6</small><h2>{steps[step]}</h2>
    {step===0 && <>{field('legalName','Full legal name',120)}<label>Verified work email<input readOnly value={admin.email}/></label>{field('phone','Direct phone / mobile',40,{type:'tel'})}{field('role','Administrative role title',100)}<label>Confirm admin password<input type="password" required autoComplete="current-password" maxLength={72} value={password} onChange={e=>setPassword(e.target.value)}/></label><p>Signed in with Community ID {admin.communityId}.</p></>}
    {step===1 && Object.entries(sectors).map(([name,[member,members,unit,units]])=><label className={s.choice} key={name}><input type="radio" name="sector" checked={data.sector===name} onChange={()=>setData({...data,sector:name,member,members,unit,units})}/><span><b>{name}</b><small>{members} · {units}</small></span></label>)}
    {step===2 && <>{field('name','Organization legal name',180)}{field('slug','Workspace slug',80,{pattern:'[a-z0-9]+(-[a-z0-9]+)*',title:'Lowercase letters, numbers and single hyphens'})}{field('city','Headquarters city',100)}{select('scale','Estimated member scale',['Up to 250','251–500','501–1,500','1,501–2,500','2,501+'])}{select('policy','Member join policy',['Admin approval','Invitation only','Open registration'])}{field('member','Member (singular)',80)}{field('members','Members (plural)',80)}{field('unit','Space (singular)',80)}{field('units','Spaces (plural)',80)}</>}
    {step===3 && <>{modules.map(m=><label className={s.choice} key={m}><input type="checkbox" checked={data.modules.includes(m)} onChange={e=>change('modules',e.target.checked?[...data.modules,m]:data.modules.filter(x=>x!==m))}/>{m}</label>)}{field('hall','Default auditorium / hall name',150,{required:data.modules.includes(modules[0])})}{select('seating','Initial seating preset',['Stalls and balcony','Single floor','Tiered theatre','Flexible seating'])}</>}
    {step===4 && <>{select('cycle','Billing cycle',['Monthly','Annual'])}{plans.map((p,i)=><label key={p} className={s.choice}><input type="radio" name="plan" checked={data.plan===p} onChange={()=>change('plan',p)}/><span><b>{p}</b><small>{data.cycle==='Annual' ? ['$39/month','$119/month','$319/month'][i]+' billed annually · ' : ''}{['Up to 250 members','Up to 2,500 members','Unlimited members'][i]}</small></span></label>)}<p>Your 14-day trial starts when you launch. No payment is collected.</p></>}
    {step===5 && <><h3>Ready to launch {data.name}?</h3><p>Primary admin · {data.legalName} ({admin.email})</p><p>Workspace slug · {data.slug}</p><p>Member registration · {data.policy}</p><p>Seating · {data.seating}</p></>}
    {error && <p role="alert">{error}</p>}</section>
    <aside><small>Live workspace preview</small><h2>{data.name || 'Your organization'}</h2><p>{data.sector}</p><p>{data.city}</p><dl>{Object.entries({'Member terminology':data.members,'Spaces':data.units,'Member scale':data.scale,'Plan':data.plan+' · '+data.cycle,'Facility':data.hall || 'Unspecified','Enabled modules':data.modules.length}).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></aside></div>
    <footer><button type="button" disabled={!step||busy} onClick={()=>setStep(step-1)}>Back</button><button disabled={busy}>{busy?'Launching…':step===5?'Launch Organization Dashboard':'Continue →'}</button></footer></form>
  </dialog>;
}
