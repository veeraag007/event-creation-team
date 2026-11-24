// Welcome page for the Community 360 Event Creation SaaS application

'use client';

import Link from 'next/link';
import { useState } from 'react';

const sectors = [
  { name: 'Professional & Business', sample: 'Apex Innovation Hub', members: 'Teams & tenants', venue: 'Conference Hall' },
  { name: 'Education & Learning', sample: 'Northstar College', members: 'Students & faculty', venue: 'Main Auditorium' },
  { name: 'Residential & Local', sample: 'Greenwood Residency', members: 'Residents', venue: 'Community Hall' },
  { name: 'Customer & Brand', sample: 'Studio Circle', members: 'Customers & members', venue: 'Launch Space' },
  { name: 'Interest & Hobby', sample: 'The Makers Guild', members: 'Creators & members', venue: 'Workshop Studio' },
  { name: 'Sports & Fitness', sample: 'Summit Sports Club', members: 'Athletes & coaches', venue: 'Indoor Arena' },
  { name: 'Social & Networking', sample: 'City Connect', members: 'Members & guests', venue: 'Grand Ballroom' },
  { name: 'Nonprofit', sample: 'Open Hands Foundation', members: 'Volunteers & donors', venue: 'Community Centre' },
];

export default function Home() {
  const [sector, setSector] = useState(sectors[0]);

  return (
    <div className="welcome">
      <header>
        <div>
          <strong>Community 360</strong>
          <small>EVENT CREATION</small>
        </div>
        <a className="setup" href="/admin-registration">
          Set up your organization
        </a>
      </header>

      <main>
        <section>
          <h1>One Unified SaaS for Every Community Vertical</h1>
          <p>Choose an organization type to see how its event workspace could look.</p>

          <h2>Choose a sector to preview</h2>
          <div className="sectors">
            {sectors.map((item) => (
              <button
                type="button"
                key={item.name}
                aria-pressed={sector.name === item.name}
                onClick={() => setSector(item)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </section>

        <aside aria-label="Workspace preview" aria-live="polite">
          <small>Sample workspace</small>
          <h2>{sector.sample}</h2>
          <p>{sector.name}</p>
          <dl>
            <div><dt>Members</dt><dd>{sector.members}</dd></div>
            <div><dt>Example venue</dt><dd>{sector.venue}</dd></div>
          </dl>
        </aside>
      </main>

      <style jsx>{`
        .welcome {
          min-height: 100vh;
          padding: 0 24px;
          background: #080d1c;
          color: #f6f7ff;
        }
        header, main { max-width: 1150px; margin: 0 auto; }
        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          padding: 24px 0;
          border-bottom: 1px solid #28334c;
        }
        small { display: block; color: #b7adff; }
        main {
          display: grid;
          grid-template-columns: 3fr 2fr;
          align-items: start;
          gap: 32px;
          padding: 64px 0;
        }
        h1 { font-size: clamp(2rem, 4vw, 3rem); line-height: 1.15; }
        section p { margin: 16px 0 28px; color: #aebbd5; }
        h2 { font-size: 1.1rem; margin: 8px 0 12px; }
        .sectors { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
        button, aside {
          background: #121b30;
          color: inherit;
          border: 1px solid #344362;
          border-radius: 12px;
        }
        button {
          min-height: 80px;
          padding: 12px;
          text-align: left;
          font: inherit;
          font-size: .9rem;
          cursor: pointer;
        }
        button[aria-pressed='true'] { background: #282050; border-color: #a997ff; }
        aside { padding: 24px; }
        dl { margin-top: 20px; }
        dl div { display: flex; justify-content: space-between; gap: 12px; margin: 10px 0; }
        dt { color: #aebbd5; }
        dd { margin: 0; text-align: right; }
        @media (max-width: 800px) {
          main { grid-template-columns: 1fr; padding: 32px 0; }
        }
        @media (max-width: 520px) {
          .sectors { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>

      <style jsx global>{`
        .welcome .setup {
          display: inline-block;
          padding: 12px 16px;
          border-radius: 10px;
          background: #5942e7;
          color: white;
          font-weight: 700;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}