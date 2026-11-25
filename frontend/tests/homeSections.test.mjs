// Checks live-event times, week boundaries and saved-event ranking across time zones.
import test from 'node:test';
import assert from 'node:assert/strict';
import { homeSections } from '../app/attendee/homeSections.mjs';

test('local Monday includes ongoing events and excludes finished or next-week events', () => {
  const base = {timezone:'Asia/Kolkata',startDate:'2026-11-23',endDate:'2026-11-23',startTime:'00:15',endTime:'01:30'};
  const events = [
    {...base,id:'live'}, {...base,id:'ended',endTime:'00:29'},
    {...base,id:'later',startTime:'01:00'}, {...base,id:'next',startDate:'2026-11-30',endDate:'2026-11-30'},
  ];
  const groups = homeSections(events,['ended','next','live'],new Date('2026-11-22T19:00:00Z'));
  assert.deepEqual(groups.live.map(e => e.id),['live']);
  assert.deepEqual(groups.week.map(e => e.id),['live','later']);
  assert.deepEqual(groups.top.map(e => e.id),['next','live']);
  assert.deepEqual(homeSections([],[]).featured,[]);
});
