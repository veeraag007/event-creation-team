import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Sun, 
  Building2, 
  Compass, 
  CloudRain, 
  Layers, 
  Armchair, 
  ShieldCheck, 
  TreePine, 
  Check
} from 'lucide-react';
import { Auditorium, VenueType } from '../types';

interface CreateVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingVenues: Auditorium[];
  onCreateVenue: (newVenue: Auditorium) => void;
}

export const CreateVenueModal: React.FC<CreateVenueModalProps> = ({
  isOpen,
  onClose,
  existingVenues,
  onCreateVenue
}) => {
  if (!isOpen) return null;

  const [venueType, setVenueType] = useState<VenueType>('open_theatre');
  const [name, setName] = useState('Rabindra Open-Air Amphitheatre');
  const [code, setCode] = useState(`OAT-${Date.now().toString().slice(-4)}`);
  const [capacity, setCapacity] = useState<number>(400);
  const [location, setLocation] = useState('East Lakeview Cultural Park & Lawn');
  const [hourlyRate, setHourlyRate] = useState<number>(2500);
  const [minBookingHours, setMinBookingHours] = useState<number>(3);
  const [securityDeposit, setSecurityDeposit] = useState<number>(15000);
  const [stageDimensions, setStageDimensions] = useState('16m x 12m Semi-Circular Thrust Stone Dais');
  const [stageType, setStageType] = useState<'semi_circular_thrust' | 'proscenium' | 'in_the_round' | 'elevated_stone_dais' | 'platform'>('semi_circular_thrust');
  const [acousticRating, setAcousticRating] = useState('Natural Amphitheatre Acoustic Shell (Ambient Tuned)');
  
  // Open Theatre specific
  const [hasRetractableCanopy, setHasRetractableCanopy] = useState(true);
  const [rainFallbackVenue, setRainFallbackVenue] = useState(existingVenues[0]?.name || 'Main Civic Auditorium');
  const [sunsetOrientation, setSunsetOrientation] = useState('Facing West (Sunset Panorama)');
  const [lawnCapacity, setLawnCapacity] = useState<number>(150);

  // Preset archetype handler
  const handleSelectArchetype = (type: VenueType) => {
    setVenueType(type);
    if (type === 'open_theatre') {
      setName('Nalanda Open-Air Amphitheatre');
      setCode(`OAT-${Math.floor(100 + Math.random() * 900)}`);
      setCapacity(380);
      setLocation('North Garden Pavilion & Promenade');
      setHourlyRate(2400);
      setStageDimensions('16m x 12m Semi-Circular Thrust Natural Stone Dais');
      setStageType('semi_circular_thrust');
      setAcousticRating('Natural Amphitheatre Acoustic Shell');
      setHasRetractableCanopy(true);
      setLawnCapacity(120);
    } else if (type === 'auditorium') {
      setName('Kalam Heritage Auditorium');
      setCode(`AUD-${Math.floor(100 + Math.random() * 900)}`);
      setCapacity(600);
      setLocation('Main Cultural Complex Wing B');
      setHourlyRate(3800);
      setStageDimensions('18m x 12m Proscenium Stage with Fly Tower & Hydraulic Pit');
      setStageType('proscenium');
      setAcousticRating('ISO 3382 Certified Proscenium (RT60: 0.95s)');
      setHasRetractableCanopy(false);
      setLawnCapacity(0);
    } else if (type === 'banquet_hall') {
      setName('Royal Sapphire Ballroom & Suite');
      setCode(`BNQ-${Math.floor(100 + Math.random() * 900)}`);
      setCapacity(450);
      setLocation('Clubhouse South Wing Ground Floor');
      setHourlyRate(4500);
      setStageDimensions('12m x 6m Modular Presentation Platform');
      setStageType('platform');
      setAcousticRating('Double-glazed Banquet Acoustic Wall Panels');
      setHasRetractableCanopy(false);
      setLawnCapacity(0);
    } else if (type === 'open_lawn') {
      setName('Whispering Pines Festival Meadow');
      setCode(`LWN-${Math.floor(100 + Math.random() * 900)}`);
      setCapacity(800);
      setLocation('West Forest Fringe Green Belt');
      setHourlyRate(3000);
      setStageDimensions('20m x 14m Outdoor Festival Truss Stage');
      setStageType('festival_stage');
      setAcousticRating('Wide Open Acoustic Dispersion Field');
      setHasRetractableCanopy(false);
      setLawnCapacity(400);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newVenueId = `fac-aud-${Date.now()}`;
    const isOpenTheatre = venueType === 'open_theatre';

    const starterBlocks = isOpenTheatre
      ? [
          {
            id: `blk-init-${Date.now()}-1`,
            auditoriumId: newVenueId,
            name: 'Lower Stone Stepped Pit (Tiers A-C)',
            tier: 'stone_steps' as const,
            level: 'Stone Pit Amphitheatre Ground',
            startRow: 'A',
            rowCount: 3,
            seatsPerRow: 10,
            aislePositions: [5],
            pricingCategory: 'Platinum' as const,
            basePrice: 1000,
            totalSeats: 30,
            status: 'active' as const,
            elevation: 1,
            curvatureAngle: 130,
            seatingMaterial: 'Handcrafted Granite Stone Bench with Cushioning',
            colorTheme: 'indigo',
            description: 'Direct semi-circular stone steps embracing the thrust stage with 130° radial sweep.',
            wheelchairAccessible: true
          },
          {
            id: `blk-init-${Date.now()}-2`,
            auditoriumId: newVenueId,
            name: 'Concentric Amphitheatre Arc (Tiers D-F)',
            tier: 'amphitheatre_tier' as const,
            level: 'Middle Terrace Arc',
            startRow: 'D',
            rowCount: 3,
            seatsPerRow: 12,
            aislePositions: [6],
            pricingCategory: 'Gold' as const,
            basePrice: 850,
            totalSeats: 36,
            status: 'active' as const,
            elevation: 2,
            curvatureAngle: 150,
            seatingMaterial: 'Teakwood Slatted Curved Arc Benches',
            hasBalconyRailing: true,
            colorTheme: 'amber',
            description: 'Concentric semi-circle arc rows with unobstructed panoramic sightlines.',
            wheelchairAccessible: false
          },
          {
            id: `blk-init-${Date.now()}-3`,
            auditoriumId: newVenueId,
            name: 'Upper Starlight Lawn Mound',
            tier: 'lawn_mound' as const,
            level: 'Upper Garden Tier',
            startRow: 'G',
            rowCount: 2,
            seatsPerRow: 12,
            aislePositions: [6],
            pricingCategory: 'Silver' as const,
            basePrice: 500,
            totalSeats: 24,
            status: 'active' as const,
            elevation: 3,
            curvatureAngle: 160,
            seatingMaterial: 'Stepped Grass Terrace & Picnic Blankets',
            hasBalconyRailing: false,
            colorTheme: 'emerald',
            description: 'Upper terrace adjacent to picnic lawn perimeter with starlight canopy views.',
            wheelchairAccessible: false
          }
        ]
      : [
          {
            id: `blk-init-${Date.now()}-1`,
            auditoriumId: newVenueId,
            name: 'Main Orchestra Stalls',
            tier: 'floor' as const,
            level: 'Ground Level - Orchestra',
            startRow: 'A',
            rowCount: 4,
            seatsPerRow: 12,
            aislePositions: [6],
            pricingCategory: 'Platinum' as const,
            basePrice: 1200,
            totalSeats: 48,
            status: 'active' as const,
            elevation: 1,
            colorTheme: 'indigo',
            description: 'Ground floor auditorium seating with wide central aisle.',
            wheelchairAccessible: true
          },
          {
            id: `blk-init-${Date.now()}-2`,
            auditoriumId: newVenueId,
            name: 'Cantilevered Balcony Tier',
            tier: 'balcony' as const,
            level: 'Level 1 Overhang (Balcony)',
            startRow: 'E',
            rowCount: 3,
            seatsPerRow: 12,
            aislePositions: [6],
            pricingCategory: 'Premium' as const,
            basePrice: 1000,
            totalSeats: 36,
            status: 'active' as const,
            elevation: 2,
            hasBalconyRailing: true,
            colorTheme: 'purple',
            description: 'Balcony layout with brass viewing railing and elevated sightline.',
            wheelchairAccessible: false
          }
        ];

    const newVenue: Auditorium = {
      id: newVenueId,
      name: name.trim(),
      code: code.trim(),
      venueType,
      seatingTopology: isOpenTheatre ? 'radial_arc' : 'standard_grid',
      capacity,
      lawnCapacity: isOpenTheatre ? lawnCapacity : undefined,
      location: location.trim(),
      todayBookings: 0,
      utilization: 40,
      revenueMonthly: 50000,
      hourlyRate,
      minBookingHours,
      securityDeposit,
      status: 'operational',
      stageDimensions: stageDimensions.trim(),
      stageType,
      acousticRating,
      greenRoomsCount: isOpenTheatre ? 2 : 3,
      lightingSystem: isOpenTheatre 
        ? 'Architectural Wash Lighting, Low-Voltage Warm Bollards & Canopy Fairy Lights' 
        : 'Motorized DMX LED Moving Heads & Followspots',
      weatherContingency: isOpenTheatre ? {
        hasRetractableCanopy,
        rainFallbackVenue,
        sunsetOrientation,
        windProtection: true
      } : undefined,
      facilities: isOpenTheatre 
        ? [
            'Weather-resistant JBL Outdoor Acoustic Line Arrays',
            'Semi-Circular Natural Granite Stone Tiering (140° Arc)',
            'Motorized Starlight Retractable Rain Canopy',
            'Greenroom Gazebo with Private Washrooms (x2)',
            'Ambient Fire-Pits & Evening Flame Torches'
          ]
        : [
            'Laser Projector 4K Ultra-HD with Cinema Scope',
            'Dolby Atmos 7.1.4 Surround Sound Array',
            'Motorized Hydraulic Stage & Fly Tower',
            'Central Climate Control & HEPA Filtration',
            'VIP Green Rooms with Ensuite Showers'
          ],
      rules: isOpenTheatre
        ? 'Evening cultural events permitted up to 10:30 PM with low-frequency acoustic limiter activated. Biodegradable props and zero open litter strictly enforced.'
        : 'Sound amplification must conclude by 10:00 PM per municipal environmental guidelines. Security deposit required.',
      blocks: starterBlocks
    };

    onCreateVenue(newVenue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Add New Venue & Theatre</h2>
              <p className="text-[11px] text-slate-500">Configure open theatre radial seating or indoor proscenium hall</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Archetype Selector */}
        <div className="px-6 pt-4 pb-3 bg-slate-50/70 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-700 block mb-2">
            Select Venue Archetype (Auto-initializes Seating Architecture):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'open_theatre' as VenueType, label: 'Open Amphitheatre', icon: Sun, desc: 'Radial semi-circle arcs & starlight' },
              { id: 'auditorium' as VenueType, label: 'Indoor Auditorium', icon: Building2, desc: 'Proscenium stage & balconies' },
              { id: 'banquet_hall' as VenueType, label: 'Banquet Ballroom', icon: Sparkles, desc: 'Table clusters & celebrations' },
              { id: 'open_lawn' as VenueType, label: 'Festival Meadow', icon: TreePine, desc: 'Unreserved picnic lawn bowl' }
            ].map(arch => {
              const Icon = arch.icon;
              const isSelected = venueType === arch.id;
              return (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => handleSelectArchetype(arch.id)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-slate-500'}`} />
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block leading-tight">{arch.label}</span>
                    <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">{arch.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Venue Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg font-medium text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Venue Permit Code</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg font-mono text-slate-800"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Total Seated Capacity</label>
              <input
                type="number"
                min={20}
                value={capacity}
                onChange={e => setCapacity(parseInt(e.target.value) || 100)}
                className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hourly Tariff (₹)</label>
              <input
                type="number"
                min={0}
                value={hourlyRate}
                onChange={e => setHourlyRate(parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Security Deposit (₹)</label>
              <input
                type="number"
                min={0}
                value={securityDeposit}
                onChange={e => setSecurityDeposit(parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-slate-300 rounded-lg font-medium text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Location / Campus Pavilion</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
              placeholder="e.g. North Garden Lawn & Lakefront Courtyard"
            />
          </div>

          {/* Stage Specifications */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="font-bold text-slate-900 block text-xs">Stage Architecture & Dimensions</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Stage Archetype</label>
                <select
                  value={stageType}
                  onChange={e => setStageType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="semi_circular_thrust">Semi-Circular Thrust Stone Dais (Open Theatre)</option>
                  <option value="proscenium">Proscenium Stage with Arch (Auditorium)</option>
                  <option value="in_the_round">In-the-Round / Center Acoustic Platform</option>
                  <option value="elevated_stone_dais">Elevated Natural Stone Platform</option>
                  <option value="platform">Modular Banquet Platform</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Stage Dimensions</label>
                <input
                  type="text"
                  value={stageDimensions}
                  onChange={e => setStageDimensions(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="e.g. 16m x 12m Semi-Circular Dais"
                />
              </div>
            </div>
          </div>

          {/* Open Theatre Weather & Contingency Settings */}
          {venueType === 'open_theatre' && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
              <span className="font-bold text-amber-950 block text-xs flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                Open-Air Weather Contingency & Atmospheric Settings
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sunset / Sun Alignment</label>
                  <select
                    value={sunsetOrientation}
                    onChange={e => setSunsetOrientation(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Facing West (Sunset Panorama)">Facing West (Direct Sunset View)</option>
                    <option value="North-South (Shaded Natural Tree Canopy)">North-South (Shaded Tree Canopy)</option>
                    <option value="Facing East (Morning Sun)">Facing East (Dawn / Morning Sun)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rain Fallback Venue</label>
                  <select
                    value={rainFallbackVenue}
                    onChange={e => setRainFallbackVenue(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {existingVenues.map(v => (
                      <option key={v.id} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Unreserved Lawn Blanket Capacity
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={lawnCapacity}
                    onChange={e => setLawnCapacity(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                  <span className="text-[10px] text-slate-500">Picnic lawn mound headcount for festivals</span>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950">
                    <input
                      type="checkbox"
                      checked={hasRetractableCanopy}
                      onChange={e => setHasRetractableCanopy(e.target.checked)}
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>Motorized Rain & Starlight Canopy Equipped</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Venue & Generate Seating Map</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
