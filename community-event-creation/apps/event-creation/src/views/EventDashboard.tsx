import React from 'react';
import { CalendarDays, FilePenLine, Megaphone, Plus, Ticket, Theater, IndianRupee } from 'lucide-react';
import { CommunityEvent } from '@shared/types';
import { StatusBadge } from '@shared/ui/UIComponents';

interface Props {
  events: CommunityEvent[];
  onCreateEvent: () => void;
  onOpenEvent: (id: string) => void;
  onOpenVenues: () => void;
}

export const EventDashboard: React.FC<Props> = ({ events, onCreateEvent, onOpenEvent, onOpenVenues }) => {
  const live = events.filter(e => e.status === 'open' || e.status === 'published');
  const drafts = events.filter(e => e.status === 'draft');
  const registrations = events.reduce((n, e) => n + e.registrations, 0);
  const revenue = events.reduce((n, e) => n + e.revenue, 0);

  const kpis = [
    { label: 'Total events', value: events.length, icon: CalendarDays, tone: 'text-indigo-600 bg-indigo-50' },
    { label: 'Live / published', value: live.length, icon: Megaphone, tone: 'text-emerald-600 bg-emerald-50' },
    { label: 'Drafts', value: drafts.length, icon: FilePenLine, tone: 'text-amber-600 bg-amber-50' },
    { label: 'Tickets booked', value: registrations.toLocaleString('en-IN'), icon: Ticket, tone: 'text-sky-600 bg-sky-50' },
    { label: 'Revenue', value: `₹${revenue.toLocaleString('en-IN')}`, icon: IndianRupee, tone: 'text-violet-600 bg-violet-50' }
  ];

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold">Plan, price and publish community events</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Create events with sessions, venues, seating and ticket tiers. Published events appear instantly in the Ticket Booking app.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={onOpenVenues} className="px-3.5 py-2 text-xs font-bold rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-1.5">
            <Theater className="w-3.5 h-3.5" /> Venues & Seating
          </button>
          <button onClick={onCreateEvent} className="px-3.5 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Create Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${k.tone}`}>
              <k.icon className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-3">{k.value}</div>
            <div className="text-[11px] font-semibold text-slate-500">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 text-sm font-bold text-slate-800">Recent events</div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wide">
            <tr>
              <th className="p-3">Event</th>
              <th className="p-3 hidden sm:table-cell">Date</th>
              <th className="p-3 hidden md:table-cell">Venue</th>
              <th className="p-3">Booked</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.slice(0, 8).map(e => (
              <tr key={e.id} onClick={() => onOpenEvent(e.id)} className="hover:bg-slate-50 cursor-pointer">
                <td className="p-3 font-semibold text-slate-800">{e.name}</td>
                <td className="p-3 hidden sm:table-cell text-slate-600">{e.date}</td>
                <td className="p-3 hidden md:table-cell text-slate-600">{e.venue}</td>
                <td className="p-3 text-slate-700">{e.registrations} / {e.capacity}</td>
                <td className="p-3"><StatusBadge status={e.status as any} /></td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-slate-400">No events yet – create your first one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
