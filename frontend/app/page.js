// Public landing page with two login paths and an animated event illustration.
import Link from 'next/link';
import styles from './page.module.css';

function Icon({ type }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 'calendar' ? <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18m-13 5h3m3 0h3m-9 3h3"/></>
      : type === 'ticket' ? <><path d="M3 7h18v4a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4V7Z"/><path d="M15 7v3m0 4v4"/></>
      : <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2m2-15a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 4v2"/></>}
  </svg>;
}
export default function Home() {
  return <div className={styles.page}>
    <header className={styles.header}>
      <Link href="/" className={styles.brand}><span className={styles.logo}>C</span><span>Community 360<small>EVENT CREATION</small></span></Link>
      <nav aria-label="Account access" className={styles.nav}><Link className={styles.secondary} href="/admin-login">Admin Login →</Link><Link className={styles.primary} href="/user-login">Attendee Login →</Link></nav>
    </header>
    <main className={styles.main}><section className={styles.hero}>
      <div className={styles.copy}>
        <span className={styles.badge}><i/> THE CONNECTED EVENT PLATFORM</span>
        <h1>One Unified SaaS for <span>Every Community Vertical.</span></h1>
        <p className={styles.tagline}>Organize. Discover. Book. All in one platform.</p>
        <p className={styles.description}>Bring people together through seamless event creation and memorable experiences.</p>
        <div className={styles.features}>
          <article><span className={styles.icon}><Icon type="calendar"/></span><div><h2>Organize events</h2><p>Create and manage events for your community.</p></div></article>
          <article><span className={styles.icon}><Icon type="ticket"/></span><div><h2>Discover &amp; book</h2><p>Find experiences and manage your registrations.</p></div></article>
        </div>
      </div>
      <div className={styles.visual} aria-hidden="true">
        <div className={styles.orbit}/><div className={styles.orbit2}/>
        <div className={styles.calendar}>
          <div className={styles.calendarTop}><span><Icon type="calendar"/> Event calendar</span><b>✦</b></div>
          <div className={styles.week}>{['M','T','W','T','F','S','S'].map((day,i)=><span key={i}>{day}</span>)}</div>
          <div className={styles.days}>{Array.from({length:28},(_,i)=><span key={i} className={[4,11,18,24].includes(i)?styles.dayActive:''}>{i+1}</span>)}</div>
          <div className={styles.calendarFoot}><i/> Plan your next experience</div>
        </div>
        <div className={styles.ticket}><span className={styles.icon}><Icon type="ticket"/></span><div><small>EVENT PASS</small><strong>You&apos;re invited!</strong><span>Discover · Connect</span></div><div className={styles.barcode}/></div>
        <div className={styles.people}><span className={styles.icon}><Icon type="people"/></span><div><strong>Connected communities</strong><span>One shared experience</span></div></div>
      </div>
    </section></main>
    <footer className={styles.footer}>Community 360 <span>·</span> Events that bring people together.</footer>
  </div>;
}
