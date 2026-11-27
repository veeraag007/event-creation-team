// Collects organization settings in six steps and launches the signed-in admin's workspace.
'use client';
import {useEffect,useRef,useState} from 'react';
import {accountRequest} from '../../attendee/api';
import s from './wizard.module.css';

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
const titles = ['Admin identity','Choose an organization sector','Organization profile and terminology','Select modules and facility spaces','Subscription plan and billing','Review and launch'];
const instructions = [
  'Confirm the identity of the administrator who will manage this workspace.',
  'Choose the sector that fits your organization to set default labels for members and spaces.',
  'Set your workspace identity and choose the vocabulary your organization uses.',
  'Select the capabilities and default facility settings for your workspace.',
  'Choose a plan and billing preference for your workspace trial.',
  'Check your settings before creating your organization workspace.',
];
const sectorDetails = [
  'Business campuses, professional teams, and innovation hubs.',
  'Colleges, training institutes, and campus organizations.',
  'Residential communities and local associations.',
  'Brand communities and customer membership programs.',
  'Maker groups, workshops, and shared interests.',
  'Sports clubs, coaches, and recreation facilities.',
  'Social groups, meetups, and professional networks.',
  'Volunteer groups, charities, and community centers.',
];
const moduleDetails = [
  'Venue layouts and seating presets.','Bookable spaces and amenities.','Event and ticketing preferences.',
  'Financial records and collections.','Invoice and statement preferences.','Polling and voting preferences.',
  'Volunteer coordination and service tracking.','Dining and food program preferences.',
  'Community announcements and updates.','Reporting and analytics preferences.',
];
const slugify = value => value.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,80).replace(/^-|-$/g,'');
export default function OrganizationWizard({admin,close,launched}) {
  const dialog = useRef(null);
  const content = useRef(null);
  const heading = useRef(null);
  const [step,setStep] = useState(0);
  const [password,setPassword] = useState('');
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const [data,setData] = useState({legalName:admin.fullName,phone:'',role:'',sector:Object.keys(sectors)[0],name:admin.organization,slug:slugify(admin.organization),city:'',scale:'Up to 250',policy:'Admin approval',member:'Tenant',members:'Teams & Tenants',unit:'Desk',units:'Workstations & Pods',modules:[modules[0],modules[2]],hall:'',seating:'Stalls and balcony',plan:plans[0],cycle:'Annual'});
  useEffect(()=>{const el=dialog.current; el.showModal(); return ()=>el.close();},[]);
  useEffect(() => {
    content.current.scrollTop = 0;
    heading.current.focus({ preventScroll: true });
  }, [step]);
  function change(key,value){setData(prev=>({...prev,[key]:value}));}
  function field(key,label,max,props={}){return <label>{label}<input required maxLength={max} value={data[key]} onChange={e=>change(key,e.target.value)} {...props}/></label>;}
  function select(key,label,options){return <label>{label}<select value={data[key]} onChange={e=>change(key,e.target.value)}>{options.map(x=><option key={x}>{x}</option>)}</select></label>;}
  async function submit(e){
    e.preventDefault();
    if(step<5){setError('');setStep(step+1);return;}
    setBusy(true);setError('');
    try {await accountRequest('admin','/organization','POST',{configuration:data,password});launched();}
    catch(e){if(e.status===401)location.replace('/admin-login');else {setError(e.message);if(e.status===409)setStep(2);if(e.message.includes('password'))setStep(0);}setBusy(false);}
  }
  const review = [
    ['Workspace slug', data.slug], ['Sector', data.sector],
    ['Primary admin', data.legalName + ' · ' + admin.email],
    ['Subscription', data.plan + ' · ' + data.cycle],
    ['Member join policy', data.policy], ['Default hall', data.hall || 'Unspecified'],
  ];
  return <dialog ref={dialog} className={s.dialog} aria-labelledby="setup-title"
    onCancel={event => { event.preventDefault(); if (!busy) close(); }}>
    <header className={s.header}>
      <span className={s.mark} aria-hidden="true">C</span>
      <div><h2 id="setup-title">Community 360 Organization Setup</h2>
        <p>Configure your sector, workspace, and subscription.</p></div>
      <span className={s.counter}>Step {step + 1} of {steps.length}</span>
      <button type="button" disabled={busy} aria-label="Close setup" onClick={close}>×</button>
    </header>
    <ol className={s.progress} aria-label="Setup progress">
      {steps.map((label, index) => <li key={label} aria-current={index === step ? 'step' : undefined} data-complete={index < step}>
        <span aria-hidden="true">{index < step ? '✓' : index + 1}</span>{label}
      </li>)}
    </ol>
    <form onSubmit={submit} className={s.form}>
      <div className={s.scroll} ref={content}>
        <div className={s.body}>
          <section className={s.main}>
            <h2 ref={heading} tabIndex={-1}>{titles[step]}</h2>
            <p className={s.intro}>{instructions[step]}</p>
            {error && <p role="alert" className={s.error}>{error}</p>}
            {step === 0 && <div className={s.fields}>
              {field('legalName','Full legal name',120)}
              <label>Verified work email<input readOnly value={admin.email}/></label>
              {field('phone','Direct phone / mobile',40,{type:'tel'})}
              {field('role','Administrative role title',100)}
              <label className={s.full}>Confirm admin password<input type="password" required autoComplete="current-password"
                maxLength={72} value={password} onChange={event => setPassword(event.target.value)}/></label>
              <p className={s.notice}>This workspace will be linked to Community ID <strong>{admin.communityId}</strong>.</p>
            </div>}
            {step === 1 && <div className={s.cards}>{Object.entries(sectors).map(([name,[member,members,unit,units]], index) =>
              <label className={s.choice} key={name}>
                <span className={s.choiceTitle}><span className={s.sectorMark} aria-hidden="true">{name[0]}</span><b>{name}</b>
                  <input type="radio" name="sector" checked={data.sector === name}
                    onChange={() => setData(previous => ({...previous,sector:name,member,members,unit,units}))}/></span>
                <small>{sectorDetails[index]}</small>
                <span className={s.choiceMeta}>Members <b>{members}</b> · Spaces <b>{units}</b></span>
              </label>)}</div>}
            {step === 2 && <>
              <div className={s.fields}>
                <div className={s.full}>{field('name','Organization legal name',180)}</div>
                {field('slug','Workspace slug',80,{pattern:'[a-z0-9]+(-[a-z0-9]+)*',title:'Lowercase letters, numbers and single hyphens'})}
                {select('scale','Estimated member scale',['Up to 250','251–500','501–1,500','1,501–2,500','2,501+'])}
                {field('city','Headquarters city',100)}
                {select('policy','Member join policy',['Admin approval','Invitation only','Open registration'])}
              </div>
              <div className={s.terminology}><h3>Custom terminology</h3><div className={s.terms}>
                {field('member','Member (singular)',80)}{field('members','Members (plural)',80)}
                {field('unit','Space (singular)',80)}{field('units','Spaces (plural)',80)}
              </div></div>
            </>}
            {step === 3 && <>
              <div className={s.cards}>{modules.map((module,index) => <label className={s.choice} key={module}>
                <span className={s.choiceTitle}><b>{module}</b><input type="checkbox" checked={data.modules.includes(module)}
                  onChange={event => change('modules',event.target.checked ? [...data.modules,module] : data.modules.filter(item => item !== module))}/></span>
                <small>{moduleDetails[index]}</small>
              </label>)}</div>
              <div className={s.subpanel}><h3>Default auditorium / hall</h3><div className={s.fields}>
                {field('hall','Auditorium / hall name',150,{required:data.modules.includes(modules[0])})}
                {select('seating','Initial seating preset',['Stalls and balcony','Single floor','Tiered theatre','Flexible seating'])}
              </div></div>
            </>}
            {step === 4 && <>
              <div className={s.billing} role="group" aria-label="Billing cycle">
                {['Monthly','Annual'].map(cycle => <button type="button" key={cycle} aria-pressed={data.cycle === cycle}
                  onClick={() => change('cycle',cycle)}>{cycle}</button>)}
              </div>
              <div className={s.plans}>{plans.map((plan,index) => <label className={s.choice} key={plan}>
                <span className={s.choiceTitle}><b>{plan}</b><input type="radio" name="plan" checked={data.plan === plan}
                  onChange={() => change('plan',plan)}/></span>
                {data.cycle === 'Annual' && <span><strong className={s.price}>${[39,119,319][index]}</strong> / month<br/><small>Billed annually</small></span>}
                <small>{['Up to 250 members','Up to 2,500 members','Unlimited members'][index]}</small>
                <span className={s.planState}>{data.plan === plan ? 'Selected' : 'Select plan'}</span>
              </label>)}</div>
              <div className={s.subpanel}><h3>14-day trial</h3><p>Your trial starts when you launch. No payment is collected.</p></div>
            </>}
            {step === 5 && <div className={s.review}>
              <span className={s.reviewMark} aria-hidden="true">✓</span>
              <h3>Ready to launch {data.name}?</h3>
              <dl className={s.reviewRows}>{review.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            </div>}
          </section>
          <aside className={s.preview} aria-label="Live workspace preview">
            <h3>Live workspace preview</h3>
            <div className={s.previewCard}>
              <div className={s.previewIdentity}><span className={s.mark} aria-hidden="true">{data.name.trim()[0]?.toUpperCase() || 'C'}</span>
                <div><b>{data.name || 'Your organization'}</b><small>{data.sector}</small><small>{data.city || 'City pending'}</small></div></div>
              <dl>{[['Members',data.members],['Spaces',data.units],['Member scale',data.scale],['Plan',data.plan],['Billing cycle',data.cycle]].map(([label,value]) =>
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            </div>
            <div className={s.previewBlock}><h4>Default facility</h4><p>{data.hall || 'No hall selected'}</p></div>
            <div className={s.previewBlock}><h4>Enabled modules <span>{data.modules.length}</span></h4>
              <p>{data.modules.join(', ') || 'No modules selected'}</p></div>
          </aside>
        </div>
      </div>
      <footer className={s.footer}>
        <button type="button" disabled={!step || busy} onClick={() => { setError(''); setStep(step - 1); }}>← Back</button>
        <button type="submit" disabled={busy}>{busy ? 'Launching…' : step === 5 ? 'Launch Organization Dashboard →' : 'Continue →'}</button>
      </footer>
    </form>
  </dialog>;
}
