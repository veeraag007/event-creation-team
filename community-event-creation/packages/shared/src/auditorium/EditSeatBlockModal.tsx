import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Save, 
  Layers
} from 'lucide-react';
import { SeatBlock, SeatBlockTier } from '../types';

interface EditSeatBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  block: SeatBlock | null;
  onUpdateBlock: (updatedBlock: SeatBlock) => void;
  onDeleteBlock: (blockId: string) => void;
}

export const EditSeatBlockModal: React.FC<EditSeatBlockModalProps> = ({
  isOpen,
  onClose,
  block,
  onUpdateBlock,
  onDeleteBlock
}) => {
  if (!isOpen || !block) return null;

  const [name, setName] = useState(block.name);
  const [tier, setTier] = useState<SeatBlockTier>(block.tier);
  const [level, setLevel] = useState(block.level);
  const [pricingCategory, setPricingCategory] = useState(block.pricingCategory);
  const [basePrice, setBasePrice] = useState(block.basePrice);
  const [hasBalconyRailing, setHasBalconyRailing] = useState(block.hasBalconyRailing || false);
  const [curvatureAngle, setCurvatureAngle] = useState(block.curvatureAngle || 140);
  const [seatingMaterial, setSeatingMaterial] = useState(block.seatingMaterial || 'Cushioned Theatre Armchair');
  const [status, setStatus] = useState(block.status);
  const [colorTheme, setColorTheme] = useState(block.colorTheme || 'indigo');
  const [description, setDescription] = useState(block.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBlock({
      ...block,
      name: name.trim() || block.name,
      tier,
      level,
      pricingCategory,
      basePrice,
      hasBalconyRailing: tier === 'balcony' || tier === 'vip_box' ? hasBalconyRailing : false,
      curvatureAngle: tier === 'amphitheatre_tier' || tier === 'stone_steps' || tier === 'lawn_mound' ? curvatureAngle : undefined,
      seatingMaterial,
      status,
      colorTheme,
      description
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove seat block "${block.name}"? All ${block.totalSeats} seats in this block will be cleared.`)) {
      onDeleteBlock(block.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Configure Seat Block</h2>
              <p className="text-[11px] text-slate-500">ID: {block.id} • {block.totalSeats} Seats</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Block Label / Title</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Block Tier</label>
              <select
                value={tier}
                onChange={e => setTier(e.target.value as SeatBlockTier)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-900"
              >
                <optgroup label="Open-Air Amphitheatre (OAT)">
                  <option value="amphitheatre_tier">Radial Amphitheatre Curved Arc</option>
                  <option value="stone_steps">Stepped Stone Pit (Natural Stone)</option>
                  <option value="lawn_mound">Upper Grass Terrace / Lawn Mound</option>
                </optgroup>
                <optgroup label="Indoor Auditorium">
                  <option value="balcony">Balcony Tier (Elevated)</option>
                  <option value="floor">Ground Floor / Stalls</option>
                  <option value="vip_box">Royal VIP Box</option>
                  <option value="mezzanine">Mezzanine Tier</option>
                  <option value="gallery">Upper Gallery</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Architectural Level</label>
              <input
                type="text"
                value={level}
                onChange={e => setLevel(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pricing Category</label>
              <select
                value={pricingCategory}
                onChange={e => setPricingCategory(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-900"
              >
                <option value="VIP">VIP Royal</option>
                <option value="Platinum">Platinum</option>
                <option value="Premium">Premium</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Seat Tariff (₹)</label>
              <input
                type="number"
                min={0}
                value={basePrice}
                onChange={e => setBasePrice(parseInt(e.target.value) || 0)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Operating Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-900"
              >
                <option value="active">Active & Bookable</option>
                <option value="maintenance">Maintenance / Renovation</option>
                <option value="closed">Closed / Off-sale</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Color Accent</label>
              <select
                value={colorTheme}
                onChange={e => setColorTheme(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-900"
              >
                <option value="purple">Purple (Balcony)</option>
                <option value="teal">Teal (Gallery)</option>
                <option value="indigo">Indigo (Stalls)</option>
                <option value="amber">Amber (Floor)</option>
                <option value="rose">Rose (VIP Box)</option>
                <option value="emerald">Emerald</option>
              </select>
            </div>
          </div>

          {/* Open Theatre Specific Controls */}
          {(tier === 'amphitheatre_tier' || tier === 'stone_steps' || tier === 'lawn_mound') && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
              <div className="flex justify-between text-xs font-bold text-amber-950">
                <span>Radial Curvature Arc Sweep</span>
                <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-800">{curvatureAngle}°</span>
              </div>
              <input
                type="range"
                min={90}
                max={180}
                step={5}
                value={curvatureAngle}
                onChange={e => setCurvatureAngle(parseInt(e.target.value) || 140)}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>90° Shallow Arc</span>
                <span>140° Standard OAT</span>
                <span>180° Semicircle</span>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Seating Material</label>
                <input
                  type="text"
                  value={seatingMaterial}
                  onChange={e => setSeatingMaterial(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 text-xs">
              <input
                type="checkbox"
                checked={hasBalconyRailing}
                onChange={e => setHasBalconyRailing(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>Render Balcony Safety Railing & Brass Ledge</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Sightline Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 flex justify-between">
            <span>Dimensions: {block.rowCount} Rows ({block.startRow}...) × {block.seatsPerRow} Cols</span>
            <span className="font-semibold text-slate-700">{block.totalSeats} Total Seats</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Block</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
