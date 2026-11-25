// Groups published events using each venue's local date and Monday–Sunday week.
function clock(now, zone) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' };
  let formatter;
  try { formatter = new Intl.DateTimeFormat('en-GB', { ...options, timeZone: zone || undefined }); }
  catch { formatter = new Intl.DateTimeFormat('en-GB', options); }
  const p = Object.fromEntries(formatter.formatToParts(now).map(part => [part.type, part.value]));
  const day = [p.year,p.month,p.day].join('-');
  const monday = new Date(day + 'T00:00:00Z');
  monday.setUTCDate(monday.getUTCDate() - (monday.getUTCDay() + 6) % 7);
  const weekStart = monday.toISOString().slice(0,10);
  monday.setUTCDate(monday.getUTCDate() + 6);
  return { stamp: day + 'T' + [p.hour,p.minute,p.second].join(':'), weekStart, weekEnd: monday.toISOString().slice(0,10) };
}
export function homeSections(events, ranking, now = new Date()) {
  const clocks = new Map();
  const upcoming = [], week = [], live = [];
  for (const event of events) {
    if (!event.startDate) continue;
    if (!clocks.has(event.timezone)) clocks.set(event.timezone, clock(now,event.timezone));
    const { stamp, weekStart, weekEnd } = clocks.get(event.timezone);
    const end = event.endDate || event.startDate;
    const startStamp = event.startDate + 'T' + (event.startTime || '00:00:00').slice(0,8).padEnd(8, ':00');
    const endStamp = end + 'T' + (event.endTime || '23:59:59').slice(0,8).padEnd(8, ':00');
    if (stamp > endStamp) continue;
    upcoming.push(event);
    if (event.startDate <= weekEnd && end >= weekStart) week.push(event);
    if (stamp >= startStamp) live.push(event);
  }
  const byStart = (a,b) => (a.startDate + (a.startTime || '')).localeCompare(b.startDate + (b.startTime || ''));
  const byId = new Map(upcoming.map(event => [event.id,event]));
  return {
    featured: upcoming.sort((a,b) => (b.publishedAt || b.updatedAt || '').localeCompare(a.publishedAt || a.updatedAt || '')).slice(0,4),
    week: week.sort(byStart), live: live.sort(byStart),
    top: ranking.map(id => byId.get(id)).filter(Boolean).slice(0,4),
  };
}
