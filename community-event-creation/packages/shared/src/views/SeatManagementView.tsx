import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Armchair, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Plus, 
  ChevronDown
} from 'lucide-react';
import { Seat, Auditorium, SeatBlock } from '../types';
import { INITIAL_AUDITORIUMS, generateSeatsForAuditorium } from '../data/eventData';
import { AddSeatBlockModal } from '../auditorium/AddSeatBlockModal';
import { EditSeatBlockModal } from '../auditorium/EditSeatBlockModal';

interface SeatManagementViewProps {
  eventId: string;
  eventName: string;
  onBack: () => void;
  onNotify?: (msg: string) => void;
}

export const SeatManagementView: React.FC<SeatManagementViewProps> = ({
  eventId,
  eventName,
  onBack,
  onNotify
}) => {
  const [auditoriums, setAuditoriums] = useState<Auditorium[]>(INITIAL_AUDITORIUMS);
  const [selectedAuditoriumId, setSelectedAuditoriumId] = useState<string>(INITIAL_AUDITORIUMS[0].id);

  const currentAuditorium = auditoriums.find(a => a.id === selectedAuditoriumId) || auditoriums[0];

  const [seats, setSeats] = useState<Seat[]>(() => generateSeatsForAuditorium(currentAuditorium));
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [filterTier, setFilterTier] = useState<string>('all');
  const [isAddBlockOpen, setIsAddBlockOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<SeatBlock | null>(null);

  // Switch auditorium
  const handleAuditoriumChange = (audId: string) => {
    setSelectedAuditoriumId(audId);
    const targetAud = auditoriums.find(a => a.id === audId) || auditoriums[0];
    setSeats(generateSeatsForAuditorium(targetAud));
    setSelectedSeat(null);
  };

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
  };

  const handleUpdateStatus = (status: Seat['status']) => {
    if (!selectedSeat) return;
    setSeats(seats.map(s => s.id === selectedSeat.id ? { ...s, status } : s));
    setSelectedSeat({ ...selectedSeat, status });
  };

  const handleUpdatePrice = (price: number) => {
    if (!selectedSeat) return;
    setSeats(seats.map(s => s.id === selectedSeat.id ? { ...s, price } : s));
    setSelectedSeat({ ...selectedSeat, price });
  };

  const handleAddBlock = (newBlock: SeatBlock) => {
    setAuditoriums(prev => prev.map(aud => {
      if (aud.id === currentAuditorium.id) {
        return {
          ...aud,
          capacity: aud.capacity + newBlock.totalSeats,
          blocks: [...aud.blocks, newBlock]
        };
      }
      return aud;
    }));

    // Generate new seats
    const newSeats: Seat[] = [];
    const startCharCode = newBlock.startRow.charCodeAt(0) || 65;
    for (let r = 0; r < newBlock.rowCount; r++) {
      const rowLetter = newBlock.startRow.length > 1 ? `${newBlock.startRow[0]}${r + 1}` : String.fromCharCode(startCharCode + r);
      for (let c = 1; c <= newBlock.seatsPerRow; c++) {
        newSeats.push({
          id: `${rowLetter}${c}`,
          auditoriumId: currentAuditorium.id,
          blockId: newBlock.id,
          blockName: newBlock.name,
          row: rowLetter,
          col: c,
          section: newBlock.pricingCategory,
          price: newBlock.basePrice,
          status: 'available',
          hasBalconyView: newBlock.tier === 'balcony' || newBlock.tier === 'vip_box'
        });
      }
    }
    setSeats(prev => [...prev, ...newSeats]);
    if (onNotify) onNotify(`Added ${newBlock.name} (${newBlock.totalSeats} seats) to event seating plan.`);
  };

  const balconyBlocks = currentAuditorium.blocks.filter(b => b.tier === 'balcony' || b.tier === 'gallery' || b.tier === 'mezzanine');
  const floorBlocks = currentAuditorium.blocks.filter(b => b.tier === 'floor');
  const vipBoxes = currentAuditorium.blocks.filter(b => b.tier === 'vip_box');

  const visibleBlocks = currentAuditorium.blocks.filter(b => {
    if (filterTier === 'all') return true;
    if (filterTier === 'balcony') return b.tier === 'balcony' || b.tier === 'gallery' || b.tier === 'mezzanine';
    if (filterTier === 'floor') return b.tier === 'floor';
    if (filterTier === 'vip_box') return b.tier === 'vip_box';
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{eventName}</h2>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                Event Seating Plan
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Venue: <span className="font-semibold text-slate-700">{currentAuditorium.name}</span> • {seats.length} Configured Seats
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Change Venue */}
          <select
            value={selectedAuditoriumId}
            onChange={e => handleAuditoriumChange(e.target.value)}
            className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700"
          >
            {auditoriums.map(aud => (
              <option key={aud.id} value={aud.id}>
                {aud.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsAddBlockOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Block (Balcony)</span>
          </button>

          <button
            onClick={() => {
              if (onNotify) onNotify(`Saved seating allocation for ${eventName} in ${currentAuditorium.name}.`);
              else alert('Auditorium seating configuration saved!');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">View Tier:</span>
        <button
          onClick={() => setFilterTier('all')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition ${
            filterTier === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          All ({currentAuditorium.blocks.length})
        </button>
        <button
          onClick={() => setFilterTier('floor')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition ${
            filterTier === 'floor' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'
          }`}
        >
          Floor / Stalls
        </button>
        <button
          onClick={() => setFilterTier('balcony')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition ${
            filterTier === 'balcony' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700'
          }`}
        >
          Balcony Tiers ({balconyBlocks.length})
        </button>
        {vipBoxes.length > 0 && (
          <button
            onClick={() => setFilterTier('vip_box')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              filterTier === 'vip_box' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700'
            }`}
          >
            VIP Boxes
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Multi-Block Seat Map Canvas */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col items-center">
          {/* Stage Area */}
          <div className="w-4/5 py-2 px-6 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 text-xs font-bold flex items-center justify-center rounded-b-xl shadow-md uppercase tracking-wider mb-6">
            Stage / Proscenium Performance Area
          </div>

          <div className="space-y-6 w-full overflow-x-auto pb-4 flex flex-col items-center">
            {/* Stalls / Floor Blocks */}
            {visibleBlocks
              .filter(b => b.tier === 'floor')
              .map(block => (
                <div key={block.id} className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between text-[11px] font-bold text-slate-300 pb-2 mb-2 border-b border-slate-800">
                    <span>{block.name}</span>
                    <span className="font-mono text-indigo-400">₹{block.basePrice}</span>
                  </div>

                  <div className="space-y-2 flex flex-col items-center">
                    {Array.from({ length: block.rowCount }).map((_, rIdx) => {
                      const charCode = block.startRow.charCodeAt(0) || 65;
                      const rLetter = block.startRow.length > 1 ? `${block.startRow[0]}${rIdx + 1}` : String.fromCharCode(charCode + rIdx);
                      return (
                        <div key={rIdx} className="flex items-center gap-1.5">
                          <span className="w-5 font-mono font-bold text-xs text-slate-500 text-center">{rLetter}</span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: block.seatsPerRow }).map((_, cIdx) => {
                              const cNum = cIdx + 1;
                              const seatId = `${rLetter}${cNum}`;
                              const seat = seats.find(s => s.id === seatId) || {
                                id: seatId,
                                row: rLetter,
                                col: cNum,
                                section: block.pricingCategory,
                                price: block.basePrice,
                                status: 'available'
                              };
                              const isSelected = selectedSeat?.id === seat.id;
                              let seatBg = 'bg-indigo-50 text-indigo-800 border-indigo-300';
                              if (seat.status === 'booked') seatBg = 'bg-slate-800 text-slate-300 border-slate-900 cursor-not-allowed';
                              else if (seat.status === 'reserved') seatBg = 'bg-amber-100 text-amber-900 border-amber-300';
                              else if (seat.status === 'disabled') seatBg = 'bg-rose-100 text-rose-700 border-rose-300 opacity-60';

                              return (
                                <button
                                  key={seatId}
                                  onClick={() => handleSeatClick(seat)}
                                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded text-[9px] font-mono font-bold border transition flex items-center justify-center ${seatBg} ${
                                    isSelected ? 'ring-2 ring-indigo-400 ring-offset-2 scale-110' : ''
                                  }`}
                                  title={`Seat ${seat.id} (${block.name}) - ₹${seat.price}`}
                                >
                                  {cNum}
                                </button>
                              );
                            })}
                          </div>
                          <span className="w-5 font-mono font-bold text-xs text-slate-500 text-center">{rLetter}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

            {/* Balcony Tiers with Balcony Railing */}
            {visibleBlocks
              .filter(b => b.tier === 'balcony' || b.tier === 'gallery' || b.tier === 'mezzanine')
              .map(balconyBlock => (
                <div
                  key={balconyBlock.id}
                  className="w-full bg-gradient-to-b from-purple-950/40 to-slate-900 border-2 border-purple-800/60 rounded-xl p-3.5 flex flex-col items-center"
                >
                  <div className="w-full flex items-center justify-between text-[11px] font-bold text-purple-200 pb-2 mb-2 border-b border-purple-800/60">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      <span>{balconyBlock.name} ({balconyBlock.level})</span>
                    </span>
                    <span className="font-mono text-purple-300">₹{balconyBlock.basePrice}</span>
                  </div>

                  {balconyBlock.hasBalconyRailing && (
                    <div className="w-full py-1 mb-3 bg-amber-500/20 border-y border-amber-400/50 text-amber-200 text-[9px] font-mono text-center font-bold tracking-widest rounded">
                      ══ BALCONY FRONT RAILINGS & OVERHANG BARRIER ══
                    </div>
                  )}

                  <div className="space-y-2 flex flex-col items-center">
                    {Array.from({ length: balconyBlock.rowCount }).map((_, rIdx) => {
                      const charCode = balconyBlock.startRow.charCodeAt(0) || 72;
                      const rLetter = balconyBlock.startRow.length > 1 ? `${balconyBlock.startRow[0]}${rIdx + 1}` : String.fromCharCode(charCode + rIdx);
                      return (
                        <div key={rIdx} className="flex items-center gap-1.5">
                          <span className="w-5 font-mono font-bold text-xs text-purple-400 text-center">{rLetter}</span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: balconyBlock.seatsPerRow }).map((_, cIdx) => {
                              const cNum = cIdx + 1;
                              const seatId = `${rLetter}${cNum}`;
                              const seat = seats.find(s => s.id === seatId) || {
                                id: seatId,
                                row: rLetter,
                                col: cNum,
                                section: balconyBlock.pricingCategory,
                                price: balconyBlock.basePrice,
                                status: 'available',
                                hasBalconyView: true
                              };
                              const isSelected = selectedSeat?.id === seat.id;
                              let seatBg = 'bg-purple-100 text-purple-900 border-purple-300';
                              if (seat.status === 'booked') seatBg = 'bg-slate-800 text-slate-300 border-slate-900 cursor-not-allowed';
                              else if (seat.status === 'reserved') seatBg = 'bg-amber-100 text-amber-900 border-amber-300';
                              else if (seat.status === 'disabled') seatBg = 'bg-rose-100 text-rose-700 border-rose-300 opacity-60';

                              return (
                                <button
                                  key={seatId}
                                  onClick={() => handleSeatClick(seat)}
                                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded text-[9px] font-mono font-bold border transition flex items-center justify-center ${seatBg} ${
                                    isSelected ? 'ring-2 ring-purple-400 ring-offset-2 scale-110' : ''
                                  }`}
                                  title={`Balcony Seat ${seat.id} (${balconyBlock.name}) - ₹${seat.price}`}
                                >
                                  {cNum}
                                </button>
                              );
                            })}
                          </div>
                          <span className="w-5 font-mono font-bold text-xs text-purple-400 text-center">{rLetter}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>

          {/* Legend */}
          <div className="pt-4 border-t border-slate-800 w-full flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-100 border border-indigo-300" />
              <span>Floor Stalls</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-purple-100 border border-purple-300" />
              <span>Balcony Tier</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-800 border border-slate-900" />
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
              <span>Reserved</span>
            </div>
          </div>
        </div>

        {/* Right: Seat Configuration Panel */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Seat Inspector & Allocation</h3>

            {selectedSeat ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-slate-400 text-[11px]">Selected Seat</div>
                  <div className="text-base font-bold text-slate-900">Seat {selectedSeat.id}</div>
                  <div className="text-slate-500 font-semibold mt-0.5">
                    {selectedSeat.blockName || 'Auditorium Block'} • {selectedSeat.section} Tier
                  </div>
                  {selectedSeat.hasBalconyView && (
                    <div className="mt-1 text-[10px] font-bold text-purple-700 flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>Elevated Balcony Sightline</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['available', 'reserved', 'disabled', 'booked'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(st)}
                        className={`py-1.5 px-2 rounded-lg font-bold capitalize border text-center transition ${
                          selectedSeat.status === st
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={selectedSeat.price}
                    onChange={e => handleUpdatePrice(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-200 rounded-lg font-bold text-slate-900"
                  />
                </div>

                {selectedSeat.assignedTo && (
                  <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                    <span className="text-[10px] uppercase font-bold text-indigo-700 block">Assigned Attendee</span>
                    <span className="font-semibold text-slate-900">{selectedSeat.assignedTo}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Click any seat in the Floor or Balcony map to inspect and configure properties.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
            Total {seats.length} seats active across {currentAuditorium.blocks.length} blocks in {currentAuditorium.name}.
          </div>
        </div>
      </div>

      {/* Add Block Modal */}
      <AddSeatBlockModal
        isOpen={isAddBlockOpen}
        onClose={() => setIsAddBlockOpen(false)}
        auditorium={currentAuditorium}
        onAddBlock={handleAddBlock}
      />
    </div>
  );
};
