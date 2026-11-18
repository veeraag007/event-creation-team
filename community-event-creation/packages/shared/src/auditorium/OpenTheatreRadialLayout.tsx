import React, { useState } from 'react';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  CloudRain, 
  ShieldCheck, 
  Layers, 
  Compass, 
  Settings2, 
  Lock, 
  Unlock, 
  Plus, 
  Armchair, 
  Maximize2,
  TreePine,
  Volume2
} from 'lucide-react';
import { Auditorium, SeatBlock, Seat } from '../types';

interface OpenTheatreRadialLayoutProps {
  auditorium: Auditorium;
  seats: Seat[];
  onSeatClick: (seat: Seat) => void;
  selectedSeatId: string | null;
  onEditBlock: (block: SeatBlock) => void;
  onAddBlockClick: () => void;
  onBulkBlockAction?: (blockId: string, action: 'reserve' | 'release' | 'maintenance') => void;
}

export const OpenTheatreRadialLayout: React.FC<OpenTheatreRadialLayoutProps> = ({
  auditorium,
  seats,
  onSeatClick,
  selectedSeatId,
  onEditBlock,
  onAddBlockClick,
  onBulkBlockAction
}) => {
  // Environmental & Atmospheric Simulation Controls
  const [ambientScene, setAmbientScene] = useState<'sunset' | 'night' | 'show'>('sunset');
  const [isCanopyExtended, setIsCanopyExtended] = useState<boolean>(
    auditorium.weatherContingency?.hasRetractableCanopy || false
  );
  const [filterBlockId, setFilterBlockId] = useState<string>('all');

  const visibleBlocks = auditorium.blocks.filter(b => {
    if (filterBlockId === 'all') return true;
    return b.id === filterBlockId;
  });

  const totalSeatsCount = auditorium.blocks.reduce((sum, b) => sum + b.totalSeats, 0);
  const stoneStepSeats = auditorium.blocks
    .filter(b => b.tier === 'stone_steps')
    .reduce((sum, b) => sum + b.totalSeats, 0);
  const radialArcSeats = auditorium.blocks
    .filter(b => b.tier === 'amphitheatre_tier')
    .reduce((sum, b) => sum + b.totalSeats, 0);
  const lawnTerraceSeats = auditorium.blocks
    .filter(b => b.tier === 'lawn_mound')
    .reduce((sum, b) => sum + b.totalSeats, 0);

  const getSeatColor = (seat: Seat, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-amber-400 text-slate-950 ring-4 ring-amber-300 ring-offset-2 ring-offset-slate-900 scale-125 z-30 font-extrabold shadow-lg';
    }
    if (seat.status === 'booked') {
      return 'bg-slate-800 text-slate-400 border-slate-700/80 cursor-not-allowed opacity-80';
    }
    if (seat.status === 'reserved') {
      return 'bg-amber-200 text-amber-950 border-amber-400 font-bold hover:bg-amber-100';
    }
    if (seat.status === 'disabled') {
      return 'bg-rose-900/60 text-rose-300 border-rose-700 opacity-60';
    }

    if (seat.section === 'VIP' || seat.section === 'Platinum') {
      return 'bg-indigo-500/90 text-white border-indigo-300 hover:bg-indigo-400 shadow-xs';
    }
    if (seat.section === 'Gold' || seat.section === 'Premium') {
      return 'bg-amber-500/90 text-slate-950 border-amber-300 hover:bg-amber-400 font-bold shadow-xs';
    }
    return 'bg-emerald-600/90 text-white border-emerald-300 hover:bg-emerald-500 shadow-xs';
  };

  // Center coordinate for radial projection
  // Canvas width = 860px, Height = 560px
  const originX = 430;
  const originY = 95;

  // Flatten rows to calculate polar radii
  let cumulativeRowIndex = 0;

  return (
    <div className="space-y-4">
      {/* Top Open-Air Environment & Weather Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Amphitheatre Atmosphere:
          </span>

          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setAmbientScene('sunset')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 ${
                ambientScene === 'sunset'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Sunset Dusk (Twilight)</span>
            </button>
            <button
              onClick={() => setAmbientScene('night')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 ${
                ambientScene === 'night'
                  ? 'bg-indigo-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-300" />
              <span>Starlight Night</span>
            </button>
            <button
              onClick={() => setAmbientScene('show')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 ${
                ambientScene === 'show'
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Performance Lights</span>
            </button>
          </div>

          {/* Canopy State Toggle */}
          <button
            onClick={() => setIsCanopyExtended(!isCanopyExtended)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
              isCanopyExtended
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title="Toggle motorized rain / starlight canopy over amphitheatre"
          >
            <CloudRain className={`w-3.5 h-3.5 ${isCanopyExtended ? 'text-emerald-600' : 'text-slate-500'}`} />
            <span>{isCanopyExtended ? 'Canopy: Extended (Rain-Safe)' : 'Canopy: Retracted (Open Sky)'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Block Filter Selector */}
          <select
            value={filterBlockId}
            onChange={e => setFilterBlockId(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white font-medium text-slate-700"
          >
            <option value="all">View All Radial Tiers ({auditorium.blocks.length})</option>
            {auditorium.blocks.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.totalSeats} seats)
              </option>
            ))}
          </select>

          <button
            onClick={onAddBlockClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Radial Arc</span>
          </button>
        </div>
      </div>

      {/* Main Radial Amphitheatre Canvas */}
      <div 
        className={`rounded-2xl border p-6 sm:p-8 shadow-2xl relative overflow-hidden transition duration-500 ${
          ambientScene === 'sunset'
            ? 'bg-gradient-to-b from-amber-950/90 via-slate-950 to-slate-950 border-amber-900/40 text-white'
            : ambientScene === 'night'
            ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-indigo-900/40 text-white'
            : 'bg-gradient-to-b from-purple-950/80 via-slate-950 to-slate-950 border-purple-900/40 text-white'
        }`}
      >
        {/* Sky Ambient Details (Starlight / Sunset glow) */}
        {ambientScene === 'night' && (
          <div className="absolute inset-0 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
        )}
        {ambientScene === 'sunset' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-gradient-to-b from-amber-500/20 to-transparent blur-3xl pointer-events-none" />
        )}

        {/* Top Floating Weather & Architectural Tags */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Compass className="w-3 h-3 text-amber-400" />
              <span>{auditorium.weatherContingency?.sunsetOrientation || 'Western Sunset View'}</span>
            </span>

            {auditorium.weatherContingency?.rainFallbackVenue && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-300 bg-slate-800/80 border border-slate-700 flex items-center gap-1">
                <CloudRain className="w-3 h-3 text-sky-400" />
                <span>Rain Backup: {auditorium.weatherContingency.rainFallbackVenue}</span>
              </span>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-emerald-400" />
              <span>Natural Acoustic Shell: {auditorium.acousticRating || 'Ambient Optimized'}</span>
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE RADIAL VISUALIZER CONTAINER                                   */}
        {/* ========================================================================= */}
        <div className="relative w-full max-w-4xl mx-auto overflow-x-auto pb-6">
          <div className="relative w-[860px] h-[550px] mx-auto select-none">
            {/* SVG Background Lines: Stage Dais, Acoustic Shell, Concentric Radial Arc Rails */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 860 550"
            >
              <defs>
                <radialGradient id="stageGlow" cx="50%" cy="40%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.02" />
                </radialGradient>
                <linearGradient id="stoneShell" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#475569" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#475569" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Acoustic Shell Curved Wall (Behind Stage) */}
              <path
                d="M 330 65 Q 430 35 530 65"
                stroke="url(#stoneShell)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
              <text x="430" y="48" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                ══ GRANITE ACOUSTIC SOUND SHELL & BACKDROP ══
              </text>

              {/* Radial Aisle Guidelines (Center aisle at 90°, Left aisle at 60°, Right aisle at 120°) */}
              <line x1="430" y1="140" x2="430" y2="480" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="430" y1="140" x2="220" y2="460" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="430" y1="140" x2="640" y2="460" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

              {/* Concentric Row Guide Arcs */}
              {Array.from({ length: 9 }).map((_, i) => {
                const r = 145 + i * 36;
                // Arc from 20 to 160 degrees
                const x1 = originX + r * Math.cos((20 * Math.PI) / 180);
                const y1 = originY + r * Math.sin((20 * Math.PI) / 180);
                const x2 = originX + r * Math.cos((160 * Math.PI) / 180);
                const y2 = originY + r * Math.sin((160 * Math.PI) / 180);
                return (
                  <path
                    key={i}
                    d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
                    stroke={i < 3 ? '#312e81' : i < 6 ? '#78350f' : '#064e3b'}
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    fill="none"
                    opacity="0.45"
                  />
                );
              })}

              {/* Outer Perimeter Lawn Arc */}
              <path
                d={`M ${originX + 475 * Math.cos((18 * Math.PI) / 180)} ${originY + 475 * Math.sin((18 * Math.PI) / 180)} A 475 475 0 0 1 ${originX + 475 * Math.cos((162 * Math.PI) / 180)} ${originY + 475 * Math.sin((162 * Math.PI) / 180)}`}
                stroke="#10b981"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
            </svg>

            {/* Stage: Semi-Circular Thrust Stone Dais */}
            <div 
              style={{ left: originX - 110, top: originY - 15 }}
              className="absolute w-[220px] h-[85px] rounded-b-full bg-gradient-to-b from-amber-600 via-amber-700 to-slate-900 border-2 border-amber-400 shadow-xl shadow-amber-900/30 flex flex-col items-center justify-center text-center z-10"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-200 uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Thrust Stage Dais</span>
                <Sparkles className="w-3 h-3 text-amber-300" />
              </div>
              <div className="text-[9px] text-amber-100/90 font-mono">
                {auditorium.stageDimensions?.split('with')[0] || '16m × 12m Semi-Circular Stone Dais'}
              </div>
              <div className="text-[8px] text-amber-300/80 font-bold tracking-wider mt-0.5">
                ◄ STAGE LEFT • CENTER PODIUM • STAGE RIGHT ►
              </div>
            </div>

            {/* Concentric Polar Seats Placement */}
            {(() => {
              cumulativeRowIndex = 0;

              return visibleBlocks.map((block) => {
                const blockElements: React.ReactNode[] = [];

                for (let r = 0; r < block.rowCount; r++) {
                  const currentRowRadius = 145 + cumulativeRowIndex * 36;
                  cumulativeRowIndex++;

                  const charCode = block.startRow.charCodeAt(0) || 65;
                  const rowLetter = block.startRow.length > 1 
                    ? `${block.startRow[0]}${r + 1}` 
                    : String.fromCharCode(charCode + r);

                  const sweep = block.curvatureAngle || 140;
                  const halfSweep = sweep / 2;
                  const startAngle = 90 - halfSweep; // centered at 90 (bottom)

                  // Row Label at left wing
                  const leftLabelAngle = startAngle - 4.5;
                  const leftLabelX = originX + currentRowRadius * Math.cos((leftLabelAngle * Math.PI) / 180);
                  const leftLabelY = originY + currentRowRadius * Math.sin((leftLabelAngle * Math.PI) / 180);

                  blockElements.push(
                    <div
                      key={`label-l-${block.id}-${r}`}
                      style={{ left: leftLabelX - 12, top: leftLabelY - 10 }}
                      className="absolute w-6 h-5 flex items-center justify-center font-mono font-bold text-[10px] text-amber-400 select-none z-10"
                    >
                      {rowLetter}
                    </div>
                  );

                  // Row Label at right wing
                  const rightLabelAngle = 90 + halfSweep + 4.5;
                  const rightLabelX = originX + currentRowRadius * Math.cos((rightLabelAngle * Math.PI) / 180);
                  const rightLabelY = originY + currentRowRadius * Math.sin((rightLabelAngle * Math.PI) / 180);

                  blockElements.push(
                    <div
                      key={`label-r-${block.id}-${r}`}
                      style={{ left: rightLabelX - 12, top: rightLabelY - 10 }}
                      className="absolute w-6 h-5 flex items-center justify-center font-mono font-bold text-[10px] text-amber-400 select-none z-10"
                    >
                      {rowLetter}
                    </div>
                  );

                  // Seats in this row
                  for (let c = 1; c <= block.seatsPerRow; c++) {
                    const seatId = `${rowLetter}${c}`;
                    const angle = startAngle + ((c - 0.5) / block.seatsPerRow) * sweep;
                    const angleRad = (angle * Math.PI) / 180;

                    const seatX = originX + currentRowRadius * Math.cos(angleRad);
                    const seatY = originY + currentRowRadius * Math.sin(angleRad);

                    const seat = seats.find(s => s.id === seatId) || {
                      id: seatId,
                      row: rowLetter,
                      col: c,
                      section: block.pricingCategory,
                      price: block.basePrice,
                      status: 'available',
                      isRadial: true,
                      angleDegrees: Math.round(angle)
                    };

                    const isSelected = selectedSeatId === seat.id;

                    blockElements.push(
                      <button
                        key={seatId}
                        style={{ left: seatX - 13, top: seatY - 13 }}
                        onClick={() => onSeatClick(seat)}
                        className={`absolute w-[26px] h-[26px] rounded-full text-[9px] font-mono font-bold border transition-all duration-150 flex items-center justify-center ${getSeatColor(
                          seat,
                          isSelected
                        )}`}
                        title={`Seat ${seat.id} (${block.name}) • Angle: ${seat.angleDegrees ?? Math.round(angle)}° [${seat.status}] - ₹${seat.price}`}
                      >
                        {c}
                      </button>
                    );
                  }
                }

                return <React.Fragment key={block.id}>{blockElements}</React.Fragment>;
              });
            })()}

            {/* Perimeter Lawn Blanket Zone Marker */}
            {auditorium.lawnCapacity && (
              <div 
                style={{ left: originX - 170, top: originY + 445 }}
                className="absolute w-[340px] py-2 px-4 rounded-full bg-emerald-950/80 border-2 border-emerald-500/70 text-emerald-200 text-xs font-semibold text-center backdrop-blur-md shadow-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <TreePine className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">Starlight Picnic Lawn Bowl</span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-900 text-emerald-100 px-2 py-0.5 rounded-full border border-emerald-400/40">
                  {auditorium.lawnCapacity} Unreserved Passes
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Legend for Radial Layout */}
        <div className="relative z-10 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 border border-indigo-300" />
            <span>Stone Pit / VIP (Platinum)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-amber-300" />
            <span>Radial Curved Arc (Gold)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 border border-emerald-300" />
            <span>Upper Terrace (Silver)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-slate-700" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-200 border border-amber-400" />
            <span>Reserved for VIPs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-900 border border-rose-700" />
            <span>Maintenance</span>
          </div>
        </div>
      </div>

      {/* Radial Block Management Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {auditorium.blocks.map((block) => (
          <div 
            key={block.id}
            className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    block.tier === 'stone_steps' ? 'bg-indigo-500' : block.tier === 'amphitheatre_tier' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <h4 className="text-xs font-bold text-slate-900">{block.name}</h4>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {block.level} • {block.totalSeats} Seats
                </span>
              </div>
              <button
                onClick={() => onEditBlock(block)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                title="Configure radial tier block"
              >
                <Settings2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-1">
              <div className="flex justify-between">
                <span>Radial Curvature Sweep:</span>
                <span className="font-bold text-slate-800">{block.curvatureAngle || 140}° Arc</span>
              </div>
              <div className="flex justify-between">
                <span>Material:</span>
                <span className="font-medium text-slate-700 truncate max-w-[150px]">{block.seatingMaterial || 'Stone Bench'}</span>
              </div>
              <div className="flex justify-between">
                <span>Tariff:</span>
                <span className="font-bold text-indigo-700">₹{block.basePrice} / seat</span>
              </div>
            </div>

            {/* Quick Bulk Actions */}
            {onBulkBlockAction && (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onBulkBlockAction(block.id, 'reserve')}
                  className="flex-1 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition flex items-center justify-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>Reserve All</span>
                </button>
                <button
                  onClick={() => onBulkBlockAction(block.id, 'release')}
                  className="flex-1 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition flex items-center justify-center gap-1"
                >
                  <Unlock className="w-3 h-3" />
                  <span>Release All</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
