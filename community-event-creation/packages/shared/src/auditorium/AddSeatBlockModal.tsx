import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Armchair, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { Auditorium, SeatBlock, SeatBlockTier } from '../types';

interface AddSeatBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditorium: Auditorium;
  onAddBlock: (newBlock: SeatBlock) => void;
}

export const AddSeatBlockModal: React.FC<AddSeatBlockModalProps> = ({
  isOpen,
  onClose,
  auditorium,
  onAddBlock
}) => {
  if (!isOpen) return null;

  const isOpenTheatre = auditorium.venueType === 'open_theatre' || auditorium.seatingTopology === 'radial_arc';

  // Form state
  const [name, setName] = useState(isOpenTheatre ? 'Concentric Amphitheatre Arc (Tiers D-F)' : 'Grand Balcony Tier 2');
  const [tier, setTier] = useState<SeatBlockTier>(isOpenTheatre ? 'amphitheatre_tier' : 'balcony');
  const [level, setLevel] = useState(isOpenTheatre ? 'Middle Terrace Arc' : 'Level 2 Overhang (Balcony)');
  const [startRow, setStartRow] = useState(isOpenTheatre ? 'D' : 'R');
  const [rowCount, setRowCount] = useState<number>(3);
  const [seatsPerRow, setSeatsPerRow] = useState<number>(12);
  const [aislePosition, setAislePosition] = useState<number>(6); // Single aisle gap
  const [pricingCategory, setPricingCategory] = useState<'Platinum' | 'Premium' | 'Gold' | 'Silver' | 'VIP'>('Premium');
  const [basePrice, setBasePrice] = useState<number>(isOpenTheatre ? 850 : 1100);
  const [hasBalconyRailing, setHasBalconyRailing] = useState<boolean>(!isOpenTheatre);
  const [curvatureAngle, setCurvatureAngle] = useState<number>(isOpenTheatre ? 145 : 0);
  const [seatingMaterial, setSeatingMaterial] = useState<string>(
    isOpenTheatre ? 'Teakwood Curved Slats' : 'Cushioned Theatre Armchair'
  );
  const [colorTheme, setColorTheme] = useState<string>(isOpenTheatre ? 'amber' : 'purple');
  const [description, setDescription] = useState(
    isOpenTheatre 
      ? 'Semi-circular radial arc tier curving 145° facing thrust stage.' 
      : 'Elevated balcony tier with clear panoramic proscenium view and safety barrier.'
  );
  const [wheelchairAccessible, setWheelchairAccessible] = useState<boolean>(false);

  // Preset templates
  const handleApplyPreset = (presetType: 'balcony' | 'upper_balcony' | 'vip_box' | 'stalls' | 'concentric_arc' | 'stone_pit' | 'lawn_terrace') => {
    if (presetType === 'concentric_arc') {
      setName('Concentric Amphitheatre Arc');
      setTier('amphitheatre_tier');
      setLevel('Middle Terrace Arc');
      setStartRow('D');
      setRowCount(3);
      setSeatsPerRow(14);
      setAislePosition(7);
      setPricingCategory('Gold');
      setBasePrice(850);
      setHasBalconyRailing(true);
      setColorTheme('amber');
      setCurvatureAngle(150);
      setSeatingMaterial('Teakwood Slatted Curved Arc Benches');
      setDescription('Concentric curved arc rows with unobstructed panoramic sightlines.');
      setWheelchairAccessible(false);
    } else if (presetType === 'stone_pit') {
      setName('Lower Stone Stepped Pit');
      setTier('stone_steps');
      setLevel('Stone Pit Ground Tier');
      setStartRow('A');
      setRowCount(3);
      setSeatsPerRow(10);
      setAislePosition(5);
      setPricingCategory('Platinum');
      setBasePrice(1100);
      setHasBalconyRailing(false);
      setColorTheme('indigo');
      setCurvatureAngle(130);
      setSeatingMaterial('Handcrafted Granite Stone Bench');
      setDescription('Direct semi-circular stone steps embracing the thrust stage.');
      setWheelchairAccessible(true);
    } else if (presetType === 'lawn_terrace') {
      setName('Upper Starlight Lawn Mound');
      setTier('lawn_mound');
      setLevel('Upper Garden Tier');
      setStartRow('G');
      setRowCount(2);
      setSeatsPerRow(12);
      setAislePosition(6);
      setPricingCategory('Silver');
      setBasePrice(500);
      setHasBalconyRailing(false);
      setColorTheme('emerald');
      setCurvatureAngle(160);
      setSeatingMaterial('Stepped Turf Lawn Blanket Seating');
      setDescription('Upper perimeter grass mound for unreserved stargazing & picnic blankets.');
      setWheelchairAccessible(false);
    } else if (presetType === 'balcony') {
      setName('Grand Balcony Tier');
      setTier('balcony');
      setLevel('Level 1 Overhang (Balcony)');
      setStartRow('J');
      setRowCount(4);
      setSeatsPerRow(14);
      setAislePosition(7);
      setPricingCategory('Premium');
      setBasePrice(1200);
      setHasBalconyRailing(true);
      setColorTheme('purple');
      setDescription('Elevated cantilevered balcony tier with upholstered seating and acoustic direct line.');
      setWheelchairAccessible(false);
    } else if (presetType === 'upper_balcony') {
      setName('Upper Balcony Gallery');
      setTier('balcony');
      setLevel('Level 2 Upper Tier (High Elevation)');
      setStartRow('P');
      setRowCount(3);
      setSeatsPerRow(12);
      setAislePosition(6);
      setPricingCategory('Silver');
      setBasePrice(750);
      setHasBalconyRailing(true);
      setColorTheme('teal');
      setDescription('Steep inclined amphitheatre-style upper balcony with immersive surround acoustics.');
      setWheelchairAccessible(false);
    } else if (presetType === 'vip_box') {
      setName('Royal Balcony Box (Left/Right)');
      setTier('vip_box');
      setLevel('Mezzanine Private Box');
      setStartRow('VB');
      setRowCount(2);
      setSeatsPerRow(6);
      setAislePosition(3);
      setPricingCategory('VIP');
      setBasePrice(2500);
      setHasBalconyRailing(true);
      setColorTheme('rose');
      setDescription('Exclusive private balcony box flanked beside stage with dedicated steward service.');
      setWheelchairAccessible(false);
    } else if (presetType === 'stalls') {
      setName('Extension Floor Stalls');
      setTier('floor');
      setLevel('Ground Level');
      setStartRow('F');
      setRowCount(3);
      setSeatsPerRow(12);
      setAislePosition(6);
      setPricingCategory('Gold');
      setBasePrice(950);
      setHasBalconyRailing(false);
      setColorTheme('amber');
      setDescription('Ground level row extension with wide center aisle access.');
      setWheelchairAccessible(true);
    }
  };

  const calculatedTotalSeats = rowCount * seatsPerRow;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newBlock: SeatBlock = {
      id: `blk-${Date.now()}`,
      auditoriumId: auditorium.id,
      name: name.trim(),
      tier,
      level,
      startRow: startRow.trim().toUpperCase() || 'A',
      rowCount: Math.max(1, Math.min(15, rowCount)),
      seatsPerRow: Math.max(2, Math.min(24, seatsPerRow)),
      aislePositions: aislePosition > 0 && aislePosition < seatsPerRow ? [aislePosition] : undefined,
      pricingCategory,
      basePrice: Math.max(0, basePrice),
      totalSeats: calculatedTotalSeats,
      status: 'active',
      elevation: tier === 'balcony' ? 2 : tier === 'vip_box' ? 2 : tier === 'lawn_mound' ? 3 : 1,
      hasBalconyRailing: tier === 'balcony' || tier === 'vip_box' ? hasBalconyRailing : false,
      curvatureAngle: tier === 'amphitheatre_tier' || tier === 'stone_steps' || tier === 'lawn_mound' ? curvatureAngle : undefined,
      seatingMaterial,
      colorTheme,
      description,
      wheelchairAccessible
    };

    onAddBlock(newBlock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add Seating Block / Balcony Tier</h2>
              <p className="text-xs text-slate-500">
                Auditorium: <span className="font-semibold text-slate-700">{auditorium.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="px-6 pt-4 pb-2 bg-indigo-50/40 border-b border-indigo-100/60">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-900 mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isOpenTheatre ? 'Open-Air Amphitheatre Arc Presets' : 'Indoor Theatre Layout Templates'}</span>
            </div>
            <span className="text-[10px] text-indigo-700 font-normal">
              {isOpenTheatre ? 'Concentric radial arcs & stone steps' : 'Proscenium stalls & cantilevered balconies'}
            </span>
          </div>

          {isOpenTheatre ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleApplyPreset('concentric_arc')}
                className="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-white hover:bg-amber-50 text-[11px] font-semibold text-amber-900 flex items-center gap-1.5 transition text-left shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Curved Radial Arc (150°)</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('stone_pit')}
                className="px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 text-[11px] font-semibold text-indigo-900 flex items-center gap-1.5 transition text-left shadow-2xs"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Stepped Stone Pit (130°)</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('lawn_terrace')}
                className="px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-white hover:bg-emerald-50 text-[11px] font-semibold text-emerald-900 flex items-center gap-1.5 transition text-left shadow-2xs"
              >
                <Armchair className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Starlight Lawn Mound</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('balcony')}
                className="px-2.5 py-1.5 rounded-lg border border-purple-200 bg-white hover:bg-purple-50 text-[11px] font-semibold text-purple-900 flex items-center gap-1.5 transition text-left shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Raised Garden Terrace</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleApplyPreset('balcony')}
                className="px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 text-[11px] font-semibold text-indigo-900 flex items-center gap-1.5 transition text-left"
              >
                <Armchair className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Grand Balcony</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('upper_balcony')}
                className="px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 text-[11px] font-semibold text-indigo-900 flex items-center gap-1.5 transition text-left"
              >
                <Layers className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Upper Balcony</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('vip_box')}
                className="px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 text-[11px] font-semibold text-indigo-900 flex items-center gap-1.5 transition text-left"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Royal VIP Box</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('stalls')}
                className="px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 text-[11px] font-semibold text-indigo-900 flex items-center gap-1.5 transition text-left"
              >
                <Armchair className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Floor Stalls</span>
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Block Name & Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Block Title / Label <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Concentric Amphitheatre Arc"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Seating Layout Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={tier}
                onChange={e => {
                  const val = e.target.value as SeatBlockTier;
                  setTier(val);
                  if (val === 'amphitheatre_tier') {
                    setCurvatureAngle(150);
                    setLevel('Middle Terrace Arc');
                    setSeatingMaterial('Teakwood Slatted Curved Arc Benches');
                  } else if (val === 'stone_steps') {
                    setCurvatureAngle(130);
                    setLevel('Stone Pit Ground Tier');
                    setSeatingMaterial('Handcrafted Granite Stone Bench');
                  } else if (val === 'lawn_mound') {
                    setCurvatureAngle(160);
                    setLevel('Upper Garden Tier');
                    setSeatingMaterial('Stepped Turf Lawn Blanket Seating');
                  } else if (val === 'balcony') {
                    setHasBalconyRailing(true);
                    setLevel('Level 1 Overhang (Balcony)');
                    setCurvatureAngle(0);
                    setSeatingMaterial('Cushioned Theatre Armchair');
                  } else if (val === 'floor') {
                    setHasBalconyRailing(false);
                    setLevel('Ground Level');
                    setCurvatureAngle(0);
                    setSeatingMaterial('Cushioned Theatre Armchair');
                  } else if (val === 'vip_box') {
                    setHasBalconyRailing(true);
                    setLevel('Mezzanine Private Box');
                    setCurvatureAngle(0);
                    setSeatingMaterial('Plush Velvet Armchair');
                  }
                }}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900 bg-white"
              >
                <optgroup label="Open-Air Amphitheatre / Open Theatre (OAT)">
                  <option value="amphitheatre_tier">Radial Amphitheatre Curved Arc (OAT)</option>
                  <option value="stone_steps">Stepped Stone Pit (Natural Stone)</option>
                  <option value="lawn_mound">Upper Grass Terrace / Lawn Blanket Mound</option>
                </optgroup>
                <optgroup label="Indoor Auditorium / Proscenium Hall">
                  <option value="balcony">Balcony Tier (Elevated Overhang)</option>
                  <option value="floor">Main Floor / Orchestra Stalls</option>
                  <option value="vip_box">Royal VIP Box / Private Balcony Wing</option>
                  <option value="mezzanine">Mezzanine Intermediate Tier</option>
                  <option value="gallery">Upper Gallery / Terrace</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* Open Theatre Curvature & Seating Material Configuration */}
          {(tier === 'amphitheatre_tier' || tier === 'stone_steps' || tier === 'lawn_mound' || isOpenTheatre) && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Open Theatre Radial Sweep & Curvature
                </span>
                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {curvatureAngle}° Radial Arc Sweep
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Arc Sweep Curvature Angle ({curvatureAngle}°)
                  </label>
                  <input
                    type="range"
                    min={90}
                    max={180}
                    step={5}
                    value={curvatureAngle}
                    onChange={e => setCurvatureAngle(parseInt(e.target.value) || 140)}
                    className="w-full accent-amber-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>90° Shallow Arc</span>
                    <span>140° Standard OAT</span>
                    <span>180° Full Semicircle</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Tier Seating Material
                  </label>
                  <select
                    value={seatingMaterial}
                    onChange={e => setSeatingMaterial(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Handcrafted Granite Stone Bench">Handcrafted Granite Stone Bench</option>
                    <option value="Teakwood Slatted Curved Arc Benches">Teakwood Slatted Curved Arc Benches</option>
                    <option value="Stepped Turf Lawn Blanket Seating">Stepped Turf Lawn Blanket Seating</option>
                    <option value="Weatherproof Aluminum Stadium Benches">Weatherproof Aluminum Stadium Benches</option>
                    <option value="Cushioned Theatre Armchair">Cushioned Theatre Armchair</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Level / Elevation & Balcony Railing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Architectural Level / Elevation
              </label>
              <input
                type="text"
                value={level}
                onChange={e => setLevel(e.target.value)}
                placeholder="e.g. Level 1 Overhang (Elevated)"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Color Accent Theme
              </label>
              <select
                value={colorTheme}
                onChange={e => setColorTheme(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900 bg-white"
              >
                <option value="amber">Amber (Curved Arc Gold / Sunlit)</option>
                <option value="indigo">Indigo (Stone Pit / Proscenium Stalls)</option>
                <option value="emerald">Emerald (Garden Amphitheatre / Lawn)</option>
                <option value="purple">Purple (Royal Balcony / Terrace)</option>
                <option value="teal">Teal (Gallery / Lakeside Deck)</option>
                <option value="rose">Rose (VIP Box Luxury)</option>
              </select>
            </div>
          </div>

          {/* Grid Dimension Specs */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Block Matrix & Row Dimensions
              </span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Calculated Total: {calculatedTotalSeats} Seats
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Starting Row</label>
                <input
                  type="text"
                  maxLength={3}
                  value={startRow}
                  onChange={e => setStartRow(e.target.value.toUpperCase())}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 uppercase"
                  placeholder="e.g. H"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Row Count</label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={rowCount}
                  onChange={e => setRowCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Seats / Row</label>
                <input
                  type="number"
                  min={2}
                  max={24}
                  value={seatsPerRow}
                  onChange={e => setSeatsPerRow(Math.max(2, parseInt(e.target.value) || 2))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Aisle Gap After</label>
                <input
                  type="number"
                  min={0}
                  max={seatsPerRow - 1}
                  value={aislePosition}
                  onChange={e => setAislePosition(parseInt(e.target.value) || 0)}
                  placeholder="Seat #"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-900"
                  title="Creates visual walkway separation after this seat column"
                />
              </div>
            </div>

            {/* Balcony Railing & Accessibility Checkboxes */}
            <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={hasBalconyRailing}
                  onChange={e => setHasBalconyRailing(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Render Balcony Safety Railing & Overhang Ledge</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={wheelchairAccessible}
                  onChange={e => setWheelchairAccessible(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Wheelchair Accessible Row</span>
              </label>
            </div>
          </div>

          {/* Pricing & Commercial Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pricing Tier
              </label>
              <select
                value={pricingCategory}
                onChange={e => {
                  const cat = e.target.value as any;
                  setPricingCategory(cat);
                  if (cat === 'Platinum') setBasePrice(1500);
                  else if (cat === 'Premium') setBasePrice(1200);
                  else if (cat === 'Gold') setBasePrice(900);
                  else if (cat === 'Silver') setBasePrice(650);
                  else if (cat === 'VIP') setBasePrice(2500);
                }}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900 bg-white"
              >
                <option value="VIP">VIP Royal (₹2,400+)</option>
                <option value="Platinum">Platinum Orchestra (₹1,500)</option>
                <option value="Premium">Premium Balcony (₹1,200)</option>
                <option value="Gold">Gold Floor (₹900)</option>
                <option value="Silver">Silver Economy (₹650)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Base Seat Tariff (₹)
              </label>
              <input
                type="number"
                min={0}
                value={basePrice}
                onChange={e => setBasePrice(parseInt(e.target.value) || 0)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Block Description & Sightline Notes
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Unobstructed central view with cushioned armrests"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          {/* Live Mini Preview of the Block Layout */}
          <div className="p-3 bg-slate-900 rounded-xl text-white space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <Armchair className="w-3.5 h-3.5 text-indigo-400" />
                Live Matrix Preview ({rowCount} Rows × {seatsPerRow} Cols)
              </span>
              {hasBalconyRailing && (
                <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                  Elevated Balcony Tier
                </span>
              )}
            </div>

            {hasBalconyRailing && (
              <div className="w-full py-1 bg-amber-500/20 border-y border-amber-400/40 text-amber-200 text-[10px] font-mono font-bold text-center tracking-wider rounded">
                ══════ BALCONY RAILING & FRONT LEDGE ══════
              </div>
            )}

            <div className="space-y-1.5 py-1 overflow-x-auto flex flex-col items-center">
              {Array.from({ length: Math.min(3, rowCount) }).map((_, rIdx) => {
                const charCode = startRow.charCodeAt(0) || 65;
                const rLetter = startRow.length > 1 ? `${startRow[0]}${rIdx + 1}` : String.fromCharCode(charCode + rIdx);
                return (
                  <div key={rIdx} className="flex items-center gap-1 text-[10px]">
                    <span className="w-4 font-mono text-slate-400 text-right">{rLetter}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(16, seatsPerRow) }).map((_, cIdx) => (
                        <React.Fragment key={cIdx}>
                          {aislePosition > 0 && cIdx === aislePosition && (
                            <span className="w-3 text-center text-slate-600 font-mono text-[8px]">•</span>
                          )}
                          <div
                            className={`w-4 h-4 rounded text-[8px] font-mono font-bold flex items-center justify-center ${
                              tier === 'balcony'
                                ? 'bg-purple-900/80 text-purple-200 border border-purple-500'
                                : tier === 'vip_box'
                                ? 'bg-rose-900/80 text-rose-200 border border-rose-500'
                                : 'bg-indigo-900/80 text-indigo-200 border border-indigo-500'
                            }`}
                          >
                            {cIdx + 1}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                );
              })}
              {rowCount > 3 && (
                <div className="text-[10px] text-slate-400 italic">
                  + {rowCount - 3} more rows configured...
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Total Auditorium Capacity will expand by <strong>+{calculatedTotalSeats} seats</strong>.
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Block to Layout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
