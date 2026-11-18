import React, { useState } from 'react';
import { 
  X, 
  Armchair, 
  Save, 
  ShieldCheck, 
  UserCheck, 
  Trash2,
  Layers,
  Sparkles
} from 'lucide-react';
import { Seat } from '../types';

interface SeatInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  seat: Seat | null;
  onUpdateSeat: (updatedSeat: Seat) => void;
}

export const SeatInspectorModal: React.FC<SeatInspectorModalProps> = ({
  isOpen,
  onClose,
  seat,
  onUpdateSeat
}) => {
  if (!isOpen || !seat) return null;

  const [status, setStatus] = useState<Seat['status']>(seat.status);
  const [price, setPrice] = useState<number>(seat.price);
  const [assignedTo, setAssignedTo] = useState<string>(seat.assignedTo || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSeat({
      ...seat,
      status,
      price,
      assignedTo: assignedTo.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
              seat.hasBalconyView 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
            }`}>
              {seat.row}{seat.col}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Seat {seat.id} Details</h3>
              <p className="text-[11px] text-slate-500">
                {seat.blockName || 'Auditorium Block'} • {seat.section}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          {/* Elevation / Balcony badge */}
          {seat.hasBalconyView && !seat.isRadial && (
            <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-2 text-purple-900">
              <Layers className="w-4 h-4 text-purple-600 shrink-0" />
              <div>
                <span className="font-bold block">Balcony Tier Seat</span>
                <span className="text-[10px] text-purple-700">Clear elevated sightline over stage proscenium</span>
              </div>
            </div>
          )}

          {/* Open-Air Amphitheatre Radial Sightline Badge */}
          {seat.isRadial && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold block">Open-Air Amphitheatre Radial Seat</span>
                <span className="text-[10px] text-amber-800">
                  {seat.sightlineToStage || 'Direct Sightline'} • Polar Angle: {seat.angleDegrees ?? 90}°
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Allocation Status</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['available', 'reserved', 'booked', 'disabled'] as const).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`py-1.5 px-2 rounded-lg font-bold capitalize border text-center transition ${
                    status === st
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Seat Tariff (₹)</label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={e => setPrice(parseInt(e.target.value) || 0)}
              className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Assigned Attendee / VIP Reservation (Optional)
            </label>
            <input
              type="text"
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              placeholder="e.g. Chief Guest / Dr. Aris Thorne"
              className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply to Seat</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
