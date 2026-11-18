import React, { useState } from 'react';
import { 
  Armchair, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  Eye, 
  Sliders, 
  Check, 
  X, 
  Settings2,
  Lock,
  Unlock,
  Plus,
  AlertCircle
} from 'lucide-react';
import { Auditorium, SeatBlock, Seat } from '../types';
import { OpenTheatreRadialLayout } from './OpenTheatreRadialLayout';

interface AuditoriumSeatingLayoutProps {
  auditorium: Auditorium;
  seats: Seat[];
  onSeatClick: (seat: Seat) => void;
  selectedSeatId: string | null;
  onEditBlock: (block: SeatBlock) => void;
  onAddBlockClick: () => void;
  onBulkBlockAction?: (blockId: string, action: 'reserve' | 'release' | 'maintenance') => void;
}

export const AuditoriumSeatingLayout: React.FC<AuditoriumSeatingLayoutProps> = ({
  auditorium,
  seats,
  onSeatClick,
  selectedSeatId,
  onEditBlock,
  onAddBlockClick,
  onBulkBlockAction
}) => {
  // If this venue is an Open Theatre / Amphitheatre with radial arcs, route to dedicated radial visualizer
  const isOpenTheatre = auditorium.venueType === 'open_theatre' || auditorium.seatingTopology === 'radial_arc';
  if (isOpenTheatre) {
    return (
      <OpenTheatreRadialLayout
        auditorium={auditorium}
        seats={seats}
        onSeatClick={onSeatClick}
        selectedSeatId={selectedSeatId}
        onEditBlock={onEditBlock}
        onAddBlockClick={onAddBlockClick}
        onBulkBlockAction={onBulkBlockAction}
      />
    );
  }

  const [filterTier, setFilterTier] = useState<string>('all');
  const [showRailingOnly, setShowRailingOnly] = useState<boolean>(false);

  // Group blocks by floor vs balcony
  const floorBlocks = auditorium.blocks.filter(b => b.tier === 'floor');
  const balconyBlocks = auditorium.blocks.filter(b => b.tier === 'balcony' || b.tier === 'gallery' || b.tier === 'mezzanine');
  const vipBoxes = auditorium.blocks.filter(b => b.tier === 'vip_box');

  const visibleBlocks = auditorium.blocks.filter(b => {
    if (filterTier === 'all') return true;
    if (filterTier === 'balcony') return b.tier === 'balcony' || b.tier === 'gallery' || b.tier === 'mezzanine';
    if (filterTier === 'floor') return b.tier === 'floor';
    if (filterTier === 'vip_box') return b.tier === 'vip_box';
    return b.id === filterTier;
  });

  // Calculate statistics
  const totalAuditoriumSeats = auditorium.blocks.reduce((acc, b) => acc + b.totalSeats, 0);
  const balconySeatCount = balconyBlocks.reduce((acc, b) => acc + b.totalSeats, 0);
  const floorSeatCount = floorBlocks.reduce((acc, b) => acc + b.totalSeats, 0);
  const vipBoxSeatCount = vipBoxes.reduce((acc, b) => acc + b.totalSeats, 0);

  const getSeatColor = (seat: Seat, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2 scale-110 shadow-md z-10';
    }
    if (seat.status === 'booked') {
      return 'bg-slate-800 text-slate-300 border-slate-900 cursor-not-allowed opacity-90';
    }
    if (seat.status === 'reserved') {
      return 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200';
    }
    if (seat.status === 'disabled') {
      return 'bg-rose-100 text-rose-700 border-rose-200 opacity-60';
    }

    // Available seats colored by section or block tier
    if (seat.section === 'VIP') {
      return 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100';
    }
    if (seat.section === 'Platinum') {
      return 'bg-indigo-50 text-indigo-800 border-indigo-300 hover:bg-indigo-100';
    }
    if (seat.section === 'Premium') {
      return 'bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100';
    }
    if (seat.section === 'Gold') {
      return 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100';
    }
    return 'bg-teal-50 text-teal-800 border-teal-300 hover:bg-teal-100';
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Filter Layout:</span>
          <button
            onClick={() => setFilterTier('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              filterTier === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Blocks ({auditorium.blocks.length})
          </button>
          <button
            onClick={() => setFilterTier('floor')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              filterTier === 'floor'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <Armchair className="w-3.5 h-3.5" />
            <span>Floor / Stalls ({floorSeatCount})</span>
          </button>
          <button
            onClick={() => setFilterTier('balcony')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              filterTier === 'balcony'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Balcony Tiers ({balconySeatCount})</span>
          </button>
          {vipBoxes.length > 0 && (
            <button
              onClick={() => setFilterTier('vip_box')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                filterTier === 'vip_box'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Royal VIP Boxes ({vipBoxSeatCount})</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddBlockClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Seat Block</span>
          </button>
        </div>
      </div>

      {/* Main Architectural Stage & Seating Canvas */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Background Subtle Architectural Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Top Header / Proscenium Stage */}
        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="w-full max-w-xl">
            {/* Proscenium Arch Frame */}
            <div className="relative py-3 px-6 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest text-center rounded-t-xl shadow-lg border-b-2 border-amber-700 flex items-center justify-between">
              <span className="text-[10px] text-amber-950 font-mono">Stage Left</span>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                <span>PERFORMANCE STAGE & PROSCENIUM ARCH</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-900" />
              </div>
              <span className="text-[10px] text-amber-950 font-mono">Stage Right</span>
            </div>

            {/* Orchestra Pit & Stage Floor Depth */}
            <div className="h-6 bg-slate-900/90 border-x border-b border-amber-900/40 rounded-b-xl flex items-center justify-center text-[10px] font-mono text-slate-400">
              ▼ Acoustic Sound Apron & Motorized Hydraulic Platform (18m × 12m) ▼
            </div>
          </div>
        </div>

        {/* Seating Blocks Container */}
        <div className="relative z-10 space-y-8 flex flex-col items-center max-w-4xl mx-auto">
          {/* Side VIP Boxes flanking the front stalls if present */}
          {vipBoxes.length > 0 && (filterTier === 'all' || filterTier === 'vip_box') && (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vipBoxes.map(vipBlock => (
                <div
                  key={vipBlock.id}
                  className="p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl relative overflow-hidden backdrop-blur-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-xs font-bold text-rose-200">{vipBlock.name}</span>
                      <span className="text-[10px] font-mono bg-rose-900/70 text-rose-300 px-1.5 py-0.5 rounded">
                        VIP Box
                      </span>
                    </div>
                    <button
                      onClick={() => onEditBlock(vipBlock)}
                      className="p-1 text-rose-400 hover:text-rose-200 hover:bg-rose-900/50 rounded transition"
                      title="Configure VIP Box"
                    >
                      <Settings2 className="w-3 h-3" />
                    </button>
                  </div>

                  {vipBlock.hasBalconyRailing && (
                    <div className="w-full py-0.5 mb-2 bg-amber-500/20 border-y border-amber-400/40 text-amber-200 text-[9px] font-mono text-center font-bold tracking-widest rounded">
                      ══ CURTAINED PRIVATE BALCONY ══
                    </div>
                  )}

                  {/* Render VIP Seats */}
                  <div className="space-y-1.5 flex flex-col items-center">
                    {Array.from({ length: vipBlock.rowCount }).map((_, rIdx) => {
                      const charCode = vipBlock.startRow.charCodeAt(0) || 86;
                      const rLetter = vipBlock.startRow.length > 1 ? `${vipBlock.startRow[0]}${rIdx + 1}` : String.fromCharCode(charCode + rIdx);
                      return (
                        <div key={rIdx} className="flex items-center gap-1.5">
                          <span className="w-5 text-[10px] font-mono font-bold text-rose-400 text-center">{rLetter}</span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: vipBlock.seatsPerRow }).map((_, cIdx) => {
                              const cNum = cIdx + 1;
                              const seatId = `${rLetter}${cNum}`;
                              const seat = seats.find(s => s.id === seatId) || {
                                id: seatId,
                                row: rLetter,
                                col: cNum,
                                section: vipBlock.pricingCategory,
                                price: vipBlock.basePrice,
                                status: 'reserved'
                              };
                              const isSelected = selectedSeatId === seat.id;

                              return (
                                <button
                                  key={seatId}
                                  onClick={() => onSeatClick(seat)}
                                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded text-[9px] font-mono font-bold border transition flex items-center justify-center ${getSeatColor(
                                    seat,
                                    isSelected
                                  )}`}
                                  title={`Seat ${seat.id} (${vipBlock.name}) - ₹${seat.price}`}
                                >
                                  {cNum}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Render Floor / Stalls Blocks */}
          {visibleBlocks
            .filter(b => b.tier === 'floor')
            .map(block => (
              <div
                key={block.id}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col items-center relative shadow-sm"
              >
                {/* Block Title & Controls */}
                <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{block.name}</h4>
                      <span className="text-[10px] text-slate-400">
                        {block.level} • {block.totalSeats} Seats • Tariff: ₹{block.basePrice}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onBulkBlockAction && (
                      <>
                        <button
                          onClick={() => onBulkBlockAction(block.id, 'reserve')}
                          className="px-2 py-1 text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-800 hover:bg-amber-900/60 rounded transition flex items-center gap-1"
                          title="Reserve entire block for VIP attendees"
                        >
                          <Lock className="w-2.5 h-2.5" />
                          <span>Reserve Block</span>
                        </button>
                        <button
                          onClick={() => onBulkBlockAction(block.id, 'release')}
                          className="px-2 py-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-800 hover:bg-emerald-900/60 rounded transition flex items-center gap-1"
                          title="Release all seats in block to available"
                        >
                          <Unlock className="w-2.5 h-2.5" />
                          <span>Make Available</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onEditBlock(block)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
                      title="Edit Block Settings"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Seat Matrix */}
                <div className="space-y-2 w-full overflow-x-auto pb-2 flex flex-col items-center">
                  {Array.from({ length: block.rowCount }).map((_, rIdx) => {
                    const charCode = block.startRow.charCodeAt(0) || 65;
                    const rLetter = block.startRow.length > 1 ? `${block.startRow[0]}${rIdx + 1}` : String.fromCharCode(charCode + rIdx);

                    return (
                      <div key={rIdx} className="flex items-center gap-2 min-w-max">
                        <span className="w-6 font-mono font-bold text-xs text-indigo-400 text-center">
                          {rLetter}
                        </span>

                        <div className="flex items-center gap-1.5">
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
                            const isSelected = selectedSeatId === seat.id;
                            const isAisle = block.aislePositions?.includes(cNum);

                            return (
                              <React.Fragment key={seatId}>
                                <button
                                  onClick={() => onSeatClick(seat)}
                                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md text-[9px] font-mono font-bold border transition flex items-center justify-center ${getSeatColor(
                                    seat,
                                    isSelected
                                  )}`}
                                  title={`Seat ${seat.id} (${block.name}) - ₹${seat.price} [${seat.status}]`}
                                >
                                  {cNum}
                                </button>
                                {isAisle && (
                                  <div className="w-4 sm:w-5 flex items-center justify-center text-[9px] font-mono text-slate-600 select-none">
                                    │
                                  </div>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>

                        <span className="w-6 font-mono font-bold text-xs text-indigo-400 text-center">
                          {rLetter}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Intermediate Aisle / Separation between Stalls and Balcony */}
          {balconyBlocks.length > 0 && floorBlocks.length > 0 && filterTier === 'all' && (
            <div className="w-full flex items-center justify-center gap-3 my-2 text-slate-500 text-xs font-mono">
              <div className="h-px bg-slate-800 flex-1" />
              <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] tracking-wider uppercase flex items-center gap-1.5 text-slate-400">
                <Layers className="w-3 h-3 text-purple-400" />
                <span>ELEVATED BALCONY OVERHANG & STAIRCASE ACCESS</span>
              </div>
              <div className="h-px bg-slate-800 flex-1" />
            </div>
          )}

          {/* Render BALCONY TIERS with Distinct Elevated Architecture & Railing */}
          {visibleBlocks
            .filter(b => b.tier === 'balcony' || b.tier === 'gallery' || b.tier === 'mezzanine')
            .map(balconyBlock => (
              <div
                key={balconyBlock.id}
                className="w-full bg-gradient-to-b from-purple-950/40 to-slate-900/90 border-2 border-purple-800/60 rounded-2xl p-4 sm:p-6 flex flex-col items-center relative shadow-lg shadow-purple-950/20 backdrop-blur-xs"
              >
                {/* Elevated Level Badge */}
                <div className="absolute top-3 left-4 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-900/80 text-purple-200 border border-purple-700/60 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-purple-300" />
                    <span>{balconyBlock.tier.toUpperCase()} TIER</span>
                  </span>
                  <span className="text-[10px] font-mono text-purple-300/80">{balconyBlock.level}</span>
                </div>

                {/* Top Controls for Balcony Block */}
                <div className="w-full flex items-center justify-end mb-4 pt-6 sm:pt-0">
                  <div className="flex items-center gap-1.5">
                    {onBulkBlockAction && (
                      <>
                        <button
                          onClick={() => onBulkBlockAction(balconyBlock.id, 'reserve')}
                          className="px-2 py-1 text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-800 hover:bg-amber-900/60 rounded transition flex items-center gap-1"
                          title="Reserve entire balcony tier for special delegation"
                        >
                          <Lock className="w-2.5 h-2.5" />
                          <span>Reserve Balcony</span>
                        </button>
                        <button
                          onClick={() => onBulkBlockAction(balconyBlock.id, 'release')}
                          className="px-2 py-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-800 hover:bg-emerald-900/60 rounded transition flex items-center gap-1"
                        >
                          <Unlock className="w-2.5 h-2.5" />
                          <span>Make Available</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onEditBlock(balconyBlock)}
                      className="p-1.5 text-purple-300 hover:text-white hover:bg-purple-900/60 rounded-lg transition"
                      title="Edit Balcony Block Settings"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* BALCONY SAFETY RAILING & OVERHANG LEDGE (Visual Architectural Feature) */}
                {balconyBlock.hasBalconyRailing && (
                  <div className="w-full max-w-2xl mb-5">
                    <div className="w-full py-1.5 px-4 bg-gradient-to-r from-amber-600/30 via-amber-400/40 to-amber-600/30 border-y-2 border-amber-400/70 text-amber-200 text-[10px] font-mono font-bold text-center tracking-widest rounded-lg shadow-xs flex items-center justify-between">
                      <span className="text-[9px] text-amber-300/80">▲ Front Ledge ▲</span>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span>BALCONY SAFETY BARRIER & BRASS VIEWING RAILING</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      </div>
                      <span className="text-[9px] text-amber-300/80">▲ Front Ledge ▲</span>
                    </div>
                    <div className="text-center text-[9px] font-mono text-purple-300/70 mt-1">
                      Unobstructed Panoramic Sightline over Stage Proscenium (Elevation Level {balconyBlock.elevation || 2})
                    </div>
                  </div>
                )}

                {/* Balcony Tiered Seats */}
                <div className="space-y-2 w-full overflow-x-auto pb-2 flex flex-col items-center">
                  {Array.from({ length: balconyBlock.rowCount }).map((_, rIdx) => {
                    const charCode = balconyBlock.startRow.charCodeAt(0) || 72;
                    const rLetter = balconyBlock.startRow.length > 1 ? `${balconyBlock.startRow[0]}${rIdx + 1}` : String.fromCharCode(charCode + rIdx);

                    return (
                      <div key={rIdx} className="flex items-center gap-2 min-w-max">
                        <span className="w-6 font-mono font-bold text-xs text-purple-300 text-center">
                          {rLetter}
                        </span>

                        <div className="flex items-center gap-1.5">
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
                            const isSelected = selectedSeatId === seat.id;
                            const isAisle = balconyBlock.aislePositions?.includes(cNum);

                            return (
                              <React.Fragment key={seatId}>
                                <button
                                  onClick={() => onSeatClick(seat)}
                                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md text-[9px] font-mono font-bold border transition flex items-center justify-center ${getSeatColor(
                                    seat,
                                    isSelected
                                  )}`}
                                  title={`Balcony Seat ${seat.id} (${balconyBlock.name}) - ₹${seat.price} [${seat.status}]`}
                                >
                                  {cNum}
                                </button>
                                {isAisle && (
                                  <div className="w-4 sm:w-5 flex items-center justify-center text-[9px] font-mono text-purple-500/70 select-none">
                                    ║
                                  </div>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>

                        <span className="w-6 font-mono font-bold text-xs text-purple-300 text-center">
                          {rLetter}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="w-full pt-3 mt-3 border-t border-purple-900/60 flex items-center justify-between text-[11px] text-purple-300">
                  <span className="italic">{balconyBlock.description}</span>
                  <span className="font-semibold text-purple-200">
                    {balconyBlock.totalSeats} Balcony Seats • ₹{balconyBlock.basePrice}/seat
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* Seating Map Legend */}
        <div className="relative z-10 mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-purple-50 border border-purple-400" />
            <span>Balcony (Premium)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-indigo-50 border border-indigo-400" />
            <span>Orchestra (Platinum)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-50 border border-amber-400" />
            <span>Floor (Gold)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-50 border border-rose-400" />
            <span>VIP Royal Box</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-900" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-200 border border-amber-400" />
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-200 border border-rose-400" />
            <span>Maintenance / Closed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
