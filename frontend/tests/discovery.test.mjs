// Tests event discovery, pagination contract and safe event detail helpers without starting Next.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import { filterEvents, initialFilters, suggestions } from '../app/attendee/discovery.js';
import { allPublishedEvents, eventDetails, eventTime, safeWebUrl, priceLabel } from '../app/attendee/eventsApi.js';

const events = [
  {id:'a',title:'Tech Summit',category:'Technology',city:'Chennai',eventType:'OFFLINE',startDate:'2026-12-10',endDate:'2026-12-11',startTime:'14:30:00',ticketType:'PAID',ticketPrice:500,status:'published'},
  {id:'b',title:'College Workshop',category:'Education',city:'Chennai',eventType:'ONLINE',startDate:'2026-10-01',endDate:'2026-10-01',startTime:'10:00:00',ticketType:'FREE',ticketPrice:0,status:'published',tags:['Java']},
];
test('search, filters and ordering', () => {
  assert.deepEqual(filterEvents(events,{...initialFilters,search:'java'},'2026-11-25').map(x=>x.id),['b']);
  assert.deepEqual(filterEvents(events,{...initialFilters,city:'Chennai',price:'PAID',status:'upcoming'},'2026-11-25').map(x=>x.id),['a']);
  assert.deepEqual(filterEvents(events,{...initialFilters,sort:'price-desc'},'2026-11-25').map(x=>x.id),['a','b']);
  assert.deepEqual(suggestions(events,'tech'),['Tech Summit','Technology']);
});
test('event API reads every page and rejects unpublished details',async t=>{
  const calls=[];
  t.mock.method(globalThis,'fetch',async url=>{
    calls.push(url);
    const page = new URL(url).searchParams.get('page');
    return {ok:true,json:async()=>page===null?{success:true,data:{...events[0],status:'draft'}}:{success:true,data:[events[Number(page)]],pagination:{totalPages:2}}};
  });
  assert.deepEqual(await allPublishedEvents(),events);
  assert.equal(calls.length,2);
  await assert.rejects(eventDetails('a'), /no longer available/);
});
test('format split times, prices and validate links',()=>{
  assert.equal(eventTime('14:30:00'),'2:30 PM');
  assert.equal(priceLabel(events[1]),'Free');
  assert.equal(safeWebUrl('javascript:alert(1)'),null);
  assert.equal(safeWebUrl('https://example.com'),'https://example.com/');
});
