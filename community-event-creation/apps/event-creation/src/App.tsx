import React, { useState } from 'react';
import { LayoutDashboard, CalendarDays, Theater } from 'lucide-react';
import { AuthGate } from '@shared/auth/AuthGate';
import { Shell, NavGroup } from '@shared/layout/Shell';
import { RestrictedViewGuard } from '@shared/ui/RestrictedViewGuard';
import { getRoleAccessLevel } from '@shared/data/rolePermissions';
import { useEvents } from '@shared/api/useEvents';
import { CreateEventWizard } from '@shared/views/CreateEventWizard';
import { EventsView } from '@shared/views/EventsView';
import { AuditoriumView } from '@shared/views/AuditoriumView';
import { SeatManagementView } from '@shared/views/SeatManagementView';
import { CommunityEvent, NavItemKey } from '@shared/types';
import { EventDashboard } from './views/EventDashboard';

const NAV_GROUPS: NavGroup[] = [
  { section: 'OVERVIEW', items: [{ key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  {
    section: 'EVENT CREATION',
    items: [
      { key: 'events', label: 'Events', icon: CalendarDays },
      { key: 'auditoriums', label: 'Venues & Seating', icon: Theater }
    ]
  }
];

export default function App() {
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3500);
  };

  return (
    <AuthGate appName="Event Creation" onToast={showToast}>
      {(auth) => <EventCreationApp auth={auth} toast={toast} showToast={showToast} />}
    </AuthGate>
  );
}

function EventCreationApp({
  auth,
  toast,
  showToast
}: {
  auth: Parameters<React.ComponentProps<typeof AuthGate>['children']>[0];
  toast: string | null;
  showToast: (msg: string) => void;
}) {
  const { user, organization } = auth;
  const { events, source, upsertEvent } = useEvents();

  const [view, setView] = useState<NavItemKey>('dashboard');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSeatManaging, setIsSeatManaging] = useState(false);

  const navigate = (next: NavItemKey, eventId?: string) => {
    setView(next);
    setIsCreating(false);
    setIsSeatManaging(false);
    setSelectedEventId(next === 'events' ? eventId ?? null : null);
  };

  const activeEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;

  const titles: Record<string, { title: string; subtitle: string; crumbs: { label: string; view?: NavItemKey }[] }> = {
    dashboard: { title: `${organization.name} · Event Studio`, subtitle: 'Overview of events you are creating and publishing', crumbs: [{ label: 'Dashboard' }] },
    events: { title: 'Events', subtitle: 'Create, schedule and publish community events', crumbs: [{ label: 'Events' }] },
    auditoriums: { title: 'Venues & Seating', subtitle: 'Design venues, seat blocks and tiers used by events', crumbs: [{ label: 'Venues & Seating' }] }
  };
  const page = isCreating
    ? { title: 'Create Event', subtitle: 'Step-by-step event wizard with ticketing and seating', crumbs: [{ label: 'Events', view: 'events' as NavItemKey }, { label: 'New Event' }] }
    : isSeatManaging
      ? { title: 'Seat Layout', subtitle: activeEvent ? `${activeEvent.name} seating plan` : 'Seating plan', crumbs: [{ label: 'Events', view: 'events' as NavItemKey }, { label: 'Seat Layout' }] }
      : titles[view] ?? titles.dashboard;

  const body = (() => {
    if (isCreating) {
      return (
        <CreateEventWizard
          onCancel={() => setIsCreating(false)}
          onSave={(ev) => {
            upsertEvent(ev as CommunityEvent);
            setIsCreating(false);
            showToast(`Event "${ev.name}" saved${source === 'offline' ? ' (offline – start the API to share with Ticket Booking)' : ' and available for booking'}.`);
          }}
        />
      );
    }
    if (isSeatManaging) {
      return (
        <SeatManagementView
          eventId={selectedEventId || events[0]?.id || 'ev-1'}
          eventName={activeEvent?.name || 'Event'}
          onBack={() => setIsSeatManaging(false)}
          onNotify={showToast}
        />
      );
    }
    if (getRoleAccessLevel(user.role, view) === 'restricted') {
      return (
        <RestrictedViewGuard
          currentRole={user.role}
          moduleKey={view}
          moduleName={page.title}
          onNavigate={navigate}
          onSwitchRole={auth.switchRole}
        />
      );
    }
    if (view === 'events') {
      return (
        <EventsView
          mode="manage"
          events={events}
          initialEventId={selectedEventId}
          onSelectEvent={setSelectedEventId}
          onCreateEvent={() => setIsCreating(true)}
          onOpenSeatManagement={(id) => {
            setSelectedEventId(id);
            setIsSeatManaging(true);
          }}
          onUpdateEvent={(ev) => {
            upsertEvent(ev);
            showToast(`Event "${ev.name}" updated.`);
          }}
        />
      );
    }
    if (view === 'auditoriums') {
      return (
        <AuditoriumView
          onOpenSeatMap={() => {
            setSelectedEventId(events[0]?.id ?? 'ev-1');
            setIsSeatManaging(true);
          }}
          onNotify={showToast}
        />
      );
    }
    return (
      <EventDashboard
        events={events}
        onCreateEvent={() => { setView('events'); setIsCreating(true); }}
        onOpenEvent={(id) => navigate('events', id)}
        onOpenVenues={() => navigate('auditoriums')}
      />
    );
  })();

  return (
    <Shell
      currentView={view}
      onNavigate={navigate}
      userProfile={user}
      onChangeRole={auth.switchRole}
      onLogout={auth.logout}
      navGroups={NAV_GROUPS}
      appName="Event Creation"
      breadcrumbs={page.crumbs}
      pageTitle={page.title}
      pageSubtitle={page.subtitle}
      organization={organization}
      onSwitchOrganization={auth.switchOrganization}
      onOpenOnboarding={auth.openOnboarding}
    >
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
      {source === 'offline' && (
        <div className="mb-3 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Events API not reachable – running on local seed data. Run <code>npm run dev:api</code> to share events with the Ticket Booking app.
        </div>
      )}
      {body}
    </Shell>
  );
}
