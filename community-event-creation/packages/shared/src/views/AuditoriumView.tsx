import React, { useState } from 'react';
import { 
  Building2, 
  Layers, 
  Armchair, 
  Plus, 
  Calendar, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  Download, 
  Printer, 
  FileText, 
  Settings2,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  Info,
  ChevronDown,
  Sun,
  CloudRain,
  Compass,
  TreePine,
  Volume2,
  MapPin,
  Clock,
  ExternalLink,
  ArrowLeft,
  Search,
  LayoutGrid,
  List,
  ChevronRight,
  Eye,
  Theater,
  Users
} from 'lucide-react';
import { Auditorium, SeatBlock, Seat, VenueType } from '../types';
import { INITIAL_AUDITORIUMS, generateSeatsForAuditorium } from '../data/eventData';
import { AddSeatBlockModal } from '../auditorium/AddSeatBlockModal';
import { EditSeatBlockModal } from '../auditorium/EditSeatBlockModal';
import { SeatInspectorModal } from '../auditorium/SeatInspectorModal';
import { AuditoriumSeatingLayout } from '../auditorium/AuditoriumSeatingLayout';
import { CreateVenueModal } from '../auditorium/CreateVenueModal';

interface AuditoriumViewProps {
  initialVenueId?: string | null;
  onOpenSeatMap?: () => void;
  onBookAuditorium?: () => void;
  onNotify?: (msg: string) => void;
}

export const AuditoriumView: React.FC<AuditoriumViewProps> = ({
  initialVenueId = null,
  onOpenSeatMap,
  onBookAuditorium,
  onNotify
}) => {
  // Store venues / auditoriums in state so admin can add/edit blocks and configure venues
  const [auditoriums, setAuditoriums] = useState<Auditorium[]>(INITIAL_AUDITORIUMS);
  // Default to null so the list of venues is shown first, as requested!
  const [selectedAuditoriumId, setSelectedAuditoriumId] = useState<string | null>(initialVenueId);
  const [activeTab, setActiveTab] = useState<'layout' | 'specs' | 'schedule'>('layout');
  const [venueFilter, setVenueFilter] = useState<'all' | 'open_theatre' | 'auditorium' | 'banquet_hall'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'operational' | 'maintenance' | 'booked'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Active venue (null when in directory list view)
  const currentAuditorium = selectedAuditoriumId 
    ? (auditoriums.find(a => a.id === selectedAuditoriumId) || null)
    : null;

  // Seats state for all venues
  const [seatsByAuditorium, setSeatsByAuditorium] = useState<Record<string, Seat[]>>(() => {
    const initialMap: Record<string, Seat[]> = {};
    INITIAL_AUDITORIUMS.forEach(aud => {
      initialMap[aud.id] = generateSeatsForAuditorium(aud);
    });
    return initialMap;
  });

  const currentSeats = currentAuditorium ? (seatsByAuditorium[currentAuditorium.id] || []) : [];

  // Modals state
  const [isAddBlockOpen, setIsAddBlockOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<SeatBlock | null>(null);
  const [inspectingSeat, setInspectingSeat] = useState<Seat | null>(null);
  const [isNewVenueModalOpen, setIsNewVenueModalOpen] = useState(false);

  // Notification helper
  const notify = (msg: string) => {
    if (onNotify) onNotify(msg);
  };

  // Add Seat Block Handler
  const handleAddBlock = (newBlock: SeatBlock) => {
    if (!currentAuditorium) return;
    // 1. Update auditorium blocks
    const updatedAuditoriums = auditoriums.map(aud => {
      if (aud.id === currentAuditorium.id) {
        const updatedBlocks = [...aud.blocks, newBlock];
        const newCapacity = updatedBlocks.reduce((sum, b) => sum + b.totalSeats, 0);
        return {
          ...aud,
          capacity: Math.max(aud.capacity, newCapacity),
          blocks: updatedBlocks
        };
      }
      return aud;
    });

    setAuditoriums(updatedAuditoriums);

    // 2. Synthesize new seats for this block
    const newSeatsForBlock: Seat[] = [];
    const startCharCode = newBlock.startRow.charCodeAt(0) || 65;

    for (let r = 0; r < newBlock.rowCount; r++) {
      const rowLetter = newBlock.startRow.length > 1 
        ? `${newBlock.startRow[0]}${r + 1}` 
        : String.fromCharCode(startCharCode + r);

      for (let c = 1; c <= newBlock.seatsPerRow; c++) {
        newSeatsForBlock.push({
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

    setSeatsByAuditorium(prev => ({
      ...prev,
      [currentAuditorium.id]: [...(prev[currentAuditorium.id] || []), ...newSeatsForBlock]
    }));

    notify(`Successfully created "${newBlock.name}" with ${newBlock.totalSeats} seats in ${currentAuditorium.name}.`);
  };

  // Update existing block
  const handleUpdateBlock = (updatedBlock: SeatBlock) => {
    setAuditoriums(prev => prev.map(aud => {
      if (aud.id === currentAuditorium.id) {
        return {
          ...aud,
          blocks: aud.blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b)
        };
      }
      return aud;
    }));

    // Update associated seats price & block metadata
    setSeatsByAuditorium(prev => {
      const currentList = prev[currentAuditorium.id] || [];
      const updatedList = currentList.map(s => {
        if (s.blockId === updatedBlock.id) {
          return {
            ...s,
            blockName: updatedBlock.name,
            section: updatedBlock.pricingCategory,
            price: updatedBlock.basePrice,
            hasBalconyView: updatedBlock.tier === 'balcony' || updatedBlock.tier === 'vip_box'
          };
        }
        return s;
      });
      return { ...prev, [currentAuditorium.id]: updatedList };
    });

    notify(`Updated seating block configuration for "${updatedBlock.name}".`);
  };

  // Delete seat block
  const handleDeleteBlock = (blockId: string) => {
    const blockToDelete = currentAuditorium.blocks.find(b => b.id === blockId);
    setAuditoriums(prev => prev.map(aud => {
      if (aud.id === currentAuditorium.id) {
        return {
          ...aud,
          blocks: aud.blocks.filter(b => b.id !== blockId)
        };
      }
      return aud;
    }));

    setSeatsByAuditorium(prev => {
      const currentList = prev[currentAuditorium.id] || [];
      return {
        ...prev,
        [currentAuditorium.id]: currentList.filter(s => s.blockId !== blockId)
      };
    });

    notify(`Removed block "${blockToDelete?.name || blockId}" from ${currentAuditorium.name}.`);
  };

  // Bulk block actions (Reserve all, Release all)
  const handleBulkBlockAction = (blockId: string, action: 'reserve' | 'release' | 'maintenance') => {
    const block = currentAuditorium.blocks.find(b => b.id === blockId);
    if (!block) return;

    setSeatsByAuditorium(prev => {
      const list = prev[currentAuditorium.id] || [];
      const updated = list.map(s => {
        if (s.blockId === blockId) {
          if (action === 'reserve') return { ...s, status: 'reserved' as const, assignedTo: 'Committee VIP' };
          if (action === 'release') return { ...s, status: 'available' as const, assignedTo: undefined };
          if (action === 'maintenance') return { ...s, status: 'disabled' as const };
        }
        return s;
      });
      return { ...prev, [currentAuditorium.id]: updated };
    });

    const actionText = action === 'reserve' ? 'reserved for VIPs' : action === 'release' ? 'released to available' : 'marked for maintenance';
    notify(`All seats in "${block.name}" have been ${actionText}.`);
  };

  // Update single seat
  const handleUpdateSeat = (updatedSeat: Seat) => {
    setSeatsByAuditorium(prev => {
      const list = prev[currentAuditorium.id] || [];
      return {
        ...prev,
        [currentAuditorium.id]: list.map(s => s.id === updatedSeat.id ? updatedSeat : s)
      };
    });
    notify(`Seat ${updatedSeat.id} updated successfully.`);
  };

  // Add new venue handler (supports open theatres & auditoriums)
  const handleCreateVenue = (newVenue: Auditorium) => {
    setAuditoriums(prev => [...prev, newVenue]);
    setSeatsByAuditorium(prev => ({
      ...prev,
      [newVenue.id]: generateSeatsForAuditorium(newVenue)
    }));
    setSelectedAuditoriumId(newVenue.id);
    setIsNewVenueModalOpen(false);
    notify(`Created new venue "${newVenue.name}" with configured ${newVenue.venueType === 'open_theatre' ? 'radial amphitheatre arcs' : 'seating blocks'}!`);
  };

  // Export seating manifest CSV
  const handleExportManifest = () => {
    const rows = [
      ['Venue Name', currentAuditorium.name],
      ['Venue Code', currentAuditorium.code],
      ['Venue Type', currentAuditorium.venueType || 'auditorium'],
      ['Total Configured Seats', totalConfiguredSeats.toString()],
      ['Stage Dimensions', currentAuditorium.stageDimensions || ''],
      ['Hourly Tariff', `Rs. ${currentAuditorium.hourlyRate}`],
      [],
      ['Seat ID', 'Block Name', 'Tier', 'Row', 'Col', 'Category', 'Base Price', 'Status', 'Radial Angle', 'Sightline']
    ];

    currentSeats.forEach(s => {
      rows.push([
        s.id,
        s.blockName || '',
        s.hasBalconyView ? 'Balcony' : s.isRadial ? 'Radial Arc' : 'Floor',
        s.row,
        s.col.toString(),
        s.section,
        s.price.toString(),
        s.status,
        s.angleDegrees ? `${s.angleDegrees} deg` : 'N/A',
        s.sightlineToStage || 'Standard'
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentAuditorium.code}_Seating_Manifest.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify(`Exported seating manifest for ${currentAuditorium.name} (${currentSeats.length} seats).`);
  };

  // Archetype Badge Helper
  const getVenueArchetypeBadge = (venue: Auditorium) => {
    if (venue.venueType === 'open_theatre') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <Sun className="w-3.5 h-3.5 text-amber-600" />
          <span>Open-Air Amphitheatre (OAT)</span>
        </span>
      );
    }
    if (venue.venueType === 'banquet_hall') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          <span>Banquet & Ballroom</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
        <Building2 className="w-3.5 h-3.5 text-indigo-600" />
        <span>Indoor Proscenium Auditorium</span>
      </span>
    );
  };

  // Directory metrics
  const totalVenuesCount = auditoriums.length;
  const openTheatresCount = auditoriums.filter(a => a.venueType === 'open_theatre').length;
  const indoorAuditoriumsCount = auditoriums.filter(a => a.venueType === 'auditorium' || !a.venueType).length;
  const banquetHallsCount = auditoriums.filter(a => a.venueType === 'banquet_hall').length;
  const totalCollectiveCapacity = auditoriums.reduce((sum, a) => sum + (a.capacity || 0), 0);
  const totalBookingsToday = auditoriums.reduce((sum, a) => sum + (a.todayBookings || 0), 0);

  // Status Badge Helper
  const getVenueStatusBadge = (status?: string) => {
    switch (status) {
      case 'operational':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Operational
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Maintenance
          </span>
        );
      case 'booked':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Booked
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Active
          </span>
        );
    }
  };

  // Filtered venues list for directory
  const filteredVenues = auditoriums.filter(venue => {
    // 1. Archetype filter
    if (venueFilter === 'open_theatre' && venue.venueType !== 'open_theatre') return false;
    if (venueFilter === 'auditorium' && venue.venueType !== 'auditorium' && venue.venueType !== undefined) return false;
    if (venueFilter === 'banquet_hall' && venue.venueType !== 'banquet_hall') return false;

    // 2. Status filter
    if (statusFilter !== 'all' && venue.status !== statusFilter) return false;

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = venue.name.toLowerCase().includes(q);
      const matchCode = venue.code.toLowerCase().includes(q);
      const matchLoc = venue.location.toLowerCase().includes(q);
      const matchStage = (venue.stageDimensions || '').toLowerCase().includes(q);
      const matchFacilities = venue.facilities.some(f => f.toLowerCase().includes(q));
      if (!matchName && !matchCode && !matchLoc && !matchStage && !matchFacilities) {
        return false;
      }
    }

    return true;
  });

  // Venue-specific stats (when currentAuditorium is selected)
  const totalConfiguredSeats = currentAuditorium ? currentAuditorium.blocks.reduce((acc, b) => acc + b.totalSeats, 0) : 0;
  const balconyBlocks = currentAuditorium ? currentAuditorium.blocks.filter(b => b.tier === 'balcony' || b.tier === 'gallery' || b.tier === 'mezzanine') : [];
  const floorBlocks = currentAuditorium ? currentAuditorium.blocks.filter(b => b.tier === 'floor' || b.tier === 'stone_steps') : [];
  const vipBoxBlocks = currentAuditorium ? currentAuditorium.blocks.filter(b => b.tier === 'vip_box') : [];
  const totalBalconySeats = balconyBlocks.reduce((acc, b) => acc + b.totalSeats, 0);
  const isOpenTheatre = currentAuditorium ? (currentAuditorium.venueType === 'open_theatre' || currentAuditorium.seatingTopology === 'radial_arc') : false;

  return (
    <div className="space-y-6">
      {/* VIEW 1: VENUES LIST & DIRECTORY (When no venue is selected) */}
      {!currentAuditorium ? (
        <div className="space-y-6">
          {/* Compact Directory Header & Slender Metrics */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Venues & Theatres</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {auditoriums.length} Venues
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure seating layouts, open-air amphitheatres (radial arcs), proscenium halls, and manage bookings.
              </p>
            </div>

            {/* Simplified Slender Inline Metrics & Create Button */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-white border border-slate-200/90 rounded-xl text-xs shadow-2xs">
                <span className="flex items-center gap-1 text-slate-600">
                  <Sun className="w-3.5 h-3.5 text-amber-600" />
                  <strong className="text-slate-900 font-bold">{openTheatresCount}</strong> OAT
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <strong className="text-slate-900 font-bold">{indoorAuditoriumsCount}</strong> Indoor
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Armchair className="w-3.5 h-3.5 text-purple-600" />
                  <strong className="text-slate-900 font-bold">{totalCollectiveCapacity.toLocaleString()}</strong> Seats
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <strong className="text-emerald-700 font-bold">{totalBookingsToday}</strong> Today
                </span>
              </div>

              <button
                onClick={() => setIsNewVenueModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Venue</span>
              </button>
            </div>
          </div>

          {/* Filter Toolbar: Search, Venue Type Dropdown, Status Dropdown, and List/Grid Switcher */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search venue name, code, location..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Venue Type Dropdown */}
              <div className="relative">
                <select
                  value={venueFilter}
                  onChange={e => setVenueFilter(e.target.value as any)}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Venue Types ({auditoriums.length})</option>
                  <option value="open_theatre">🏛️ Open Theatres ({openTheatresCount})</option>
                  <option value="auditorium">🎭 Indoor Auditoriums ({indoorAuditoriumsCount})</option>
                  <option value="banquet_hall">🥂 Banquet & Ballrooms ({banquetHallsCount})</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Status Dropdown */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="operational">Operational</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="booked">Booked</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* View Mode Toggle: List (default) vs Grid */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
                title="List View (Default)"
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
            </div>
          </div>

          {/* Venues Directory Content (Grid or Table) */}
          {filteredVenues.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No matching venues found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search query or reset the archetype and status filters to view existing facilities.
              </p>
              <button
                onClick={() => { setVenueFilter('all'); setStatusFilter('all'); setSearchQuery(''); }}
                className="px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVenues.map(venue => {
                const configuredSeats = venue.blocks.reduce((sum, b) => sum + b.totalSeats, 0);
                const isOAT = venue.venueType === 'open_theatre' || venue.seatingTopology === 'radial_arc';
                
                return (
                  <div
                    key={venue.id}
                    onClick={() => setSelectedAuditoriumId(venue.id)}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-indigo-500 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Badges: Type and Status */}
                      <div className="flex items-center justify-between gap-2">
                        {getVenueArchetypeBadge(venue)}
                        {getVenueStatusBadge(venue.status)}
                      </div>

                      {/* Title & Location */}
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition flex items-center justify-between">
                          <span>{venue.name}</span>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{venue.location}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-400 shrink-0">{venue.code}</span>
                        </p>
                      </div>

                      {/* Capacity & Tariff Metrics Box */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-3 gap-2 text-center">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Capacity</span>
                          <span className="text-sm font-extrabold text-slate-900 block">{venue.capacity} Pax</span>
                          <span className="text-[10px] text-slate-500 block">Permit Max</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Seat Plan</span>
                          <span className="text-sm font-extrabold text-indigo-700 block">{configuredSeats} Seats</span>
                          <span className="text-[10px] text-indigo-500 block">
                            {isOAT && venue.lawnCapacity ? `+${venue.lawnCapacity} Lawn` : `${venue.blocks.length} Blocks`}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Tariff</span>
                          <span className="text-sm font-extrabold text-slate-900 block">₹{venue.hourlyRate}/h</span>
                          <span className="text-[10px] text-emerald-600 font-semibold block">{venue.utilization}% Util</span>
                        </div>
                      </div>

                      {/* Stage & Topology Spec Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {isOAT ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 text-[10px] font-bold border border-amber-200 flex items-center gap-1">
                            <Sun className="w-3 h-3 text-amber-600" />
                            Radial Arcs (r, θ)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200 flex items-center gap-1">
                            <Armchair className="w-3 h-3 text-slate-500" />
                            Cartesian Grid Stalls
                          </span>
                        )}

                        {venue.weatherContingency?.hasRetractableCanopy && (
                          <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 text-[10px] font-bold border border-sky-200 flex items-center gap-1">
                            <CloudRain className="w-3 h-3 text-sky-600" />
                            Rain Canopy
                          </span>
                        )}

                        {venue.weatherContingency?.sunsetOrientation && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50/70 text-amber-800 text-[10px] font-medium border border-amber-200">
                            {venue.weatherContingency.sunsetOrientation}
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200 truncate max-w-[180px]">
                          {venue.stageDimensions}
                        </span>
                      </div>

                      {/* Key Facilities Highlights */}
                      <div className="text-[11px] text-slate-500 line-clamp-1 border-t border-slate-100 pt-2">
                        {venue.facilities.slice(0, 3).join(' • ')}
                      </div>
                    </div>

                    {/* Card CTA Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Venue & Seating Map</span>
                      </span>
                      <span className="text-[11px] text-slate-400 group-hover:text-indigo-600 transition">
                        Configure →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Venue & Location</th>
                      <th className="py-3.5 px-4">Archetype</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Capacity / Seats</th>
                      <th className="py-3.5 px-4">Stage & Topology</th>
                      <th className="py-3.5 px-4">Rental Tariff</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVenues.map(venue => {
                      const configuredSeats = venue.blocks.reduce((sum, b) => sum + b.totalSeats, 0);
                      const isOAT = venue.venueType === 'open_theatre' || venue.seatingTopology === 'radial_arc';

                      return (
                        <tr
                          key={venue.id}
                          onClick={() => setSelectedAuditoriumId(venue.id)}
                          className="hover:bg-slate-50/80 cursor-pointer transition group"
                        >
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition">{venue.name}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              <span>{venue.location}</span>
                              <span>•</span>
                              <span className="font-mono">{venue.code}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            {getVenueArchetypeBadge(venue)}
                          </td>
                          <td className="py-3.5 px-4">
                            {getVenueStatusBadge(venue.status)}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{venue.capacity} Max Pax</div>
                            <div className="text-[11px] text-indigo-600 font-semibold">{configuredSeats} Configured Seats</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800">
                              {isOAT ? 'Concentric Radial (r, θ)' : 'Cartesian Stalls'}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[160px]">{venue.stageDimensions}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">₹{venue.hourlyRate}/hr</div>
                            <div className="text-[11px] text-emerald-600 font-medium">{venue.utilization}% Monthly Util</div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAuditoriumId(venue.id);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-200 rounded-lg transition"
                            >
                              <span>Open Map</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: VENUE FULL INFORMATION VIEW (When a venue is selected) */
        <div className="space-y-6">
          {/* Top Back Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedAuditoriumId(null)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition group"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to All Venues</span>
              </button>

              <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="hidden sm:inline">Venues Directory</span>
                <span className="hidden sm:inline">/</span>
                <span className="font-bold text-slate-900">{currentAuditorium.name}</span>
              </div>
            </div>

            {/* Quick venue switcher dropdown + Create New Venue */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={currentAuditorium.id}
                  onChange={e => setSelectedAuditoriumId(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs rounded-xl pl-3 pr-8 py-1.5 focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs hover:bg-slate-100 transition"
                >
                  {auditoriums.map(aud => (
                    <option key={aud.id} value={aud.id}>
                      {aud.venueType === 'open_theatre' ? '🏛️ ' : aud.venueType === 'banquet_hall' ? '🥂 ' : '🎭 '}
                      {aud.name} ({aud.capacity} Cap)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                onClick={() => setIsNewVenueModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Create Venue</span>
              </button>
            </div>
          </div>

          {/* Top Venue Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Venue Details:
                  </span>

                  <h2 className="text-lg font-bold text-slate-900">{currentAuditorium.name}</h2>

                  {getVenueArchetypeBadge(currentAuditorium)}

                  {getVenueStatusBadge(currentAuditorium.status)}

                  {currentAuditorium.weatherContingency?.hasRetractableCanopy && (
                    <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 flex items-center gap-1">
                      <CloudRain className="w-3 h-3 text-sky-600" />
                      <span>Rain Canopy Equipped</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {currentAuditorium.location}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-slate-600">{currentAuditorium.code}</span>
                  <span>•</span>
                  <span>{currentAuditorium.stageDimensions}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsAddBlockOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isOpenTheatre ? 'Add Radial Arc Tier' : 'Add Seat Block'}</span>
                </button>

                <button
                  onClick={handleExportManifest}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200"
                  title="Download full seating breakdown spreadsheet"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Export CSV</span>
                </button>

                {onBookAuditorium && (
                  <button
                    onClick={onBookAuditorium}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200"
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    <span>Book Slot</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    notify(`Saved seating configuration for ${currentAuditorium.name} (${totalConfiguredSeats} seats across ${currentAuditorium.blocks.length} blocks).`);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                  title="Save Seating Layout"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Save Layout</span>
                </button>
              </div>
            </div>

            {/* Simplified Slender Metrics Strip */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Layout:</span>
                <span className="font-bold text-slate-900">{totalConfiguredSeats} Seats</span>
                <span className="text-[11px] text-slate-400">({currentAuditorium.blocks.length} Tiers)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">
                  {isOpenTheatre ? 'Lawn Passes:' : 'Balcony:'}
                </span>
                <span className="font-bold text-purple-700">
                  {isOpenTheatre ? `${currentAuditorium.lawnCapacity || 120} Passes` : `${totalBalconySeats} Seats`}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">
                  {isOpenTheatre ? 'Stone Pit:' : 'Floor Stalls:'}
                </span>
                <span className="font-bold text-indigo-700">
                  {floorBlocks.reduce((sum, b) => sum + b.totalSeats, 0)} Seats
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Tariff:</span>
                <span className="font-bold text-slate-900">₹{currentAuditorium.hourlyRate}/hr</span>
                <span className="text-[11px] text-emerald-600 font-semibold">({currentAuditorium.utilization}% Util)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Today:</span>
                <span className="font-bold text-slate-900">{currentAuditorium.todayBookings} Events</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
            <button
              onClick={() => setActiveTab('layout')}
              className={`pb-3 border-b-2 flex items-center gap-2 transition ${
                activeTab === 'layout'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Armchair className="w-4 h-4" />
              <span>Seating Blocks & Layout Architect (Admin)</span>
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 border-b-2 flex items-center gap-2 transition ${
                activeTab === 'specs'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Facility Amenities & Stage Specs</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`pb-3 border-b-2 flex items-center gap-2 transition ${
                activeTab === 'schedule'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Hall Bookings & Civic Protocol</span>
            </button>
          </div>

          {/* Tab 1: Seating Blocks & Layout Architect */}
          {activeTab === 'layout' && (
            <div className="space-y-6">
              {/* Blocks Configuration Strip (Cards of Configured Blocks) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Configured Seat Blocks for {currentAuditorium.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Manage tiers, elevations, pricing, balcony railings, or click "+ Add Block" to expand the seating plan.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddBlockOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Block</span>
                  </button>
                </div>

                {/* Grid of Block Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  {currentAuditorium.blocks.map(block => {
                    const isBalcony = block.tier === 'balcony' || block.tier === 'gallery' || block.tier === 'mezzanine';
                    const isVip = block.tier === 'vip_box';

                    return (
                      <div
                        key={block.id}
                        className={`p-3.5 rounded-xl border transition ${
                          isBalcony
                            ? 'bg-purple-50/50 border-purple-200 hover:border-purple-300'
                            : isVip
                            ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                isBalcony
                                  ? 'bg-purple-600 text-white'
                                  : isVip
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-indigo-600 text-white'
                              }`}
                            >
                              {isBalcony ? <Layers className="w-3.5 h-3.5" /> : isVip ? <ShieldCheck className="w-3.5 h-3.5" /> : <Armchair className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 leading-tight">{block.name}</h4>
                              <span className="text-[10px] font-semibold text-slate-500 uppercase">
                                {block.tier} • {block.level}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => setEditingBlock(block)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                            title="Configure Block"
                          >
                            <Settings2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 grid grid-cols-3 gap-1 text-[11px]">
                          <div>
                            <span className="text-slate-400 text-[10px] block">Capacity</span>
                            <span className="font-bold text-slate-900">{block.totalSeats} seats</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">Matrix</span>
                            <span className="font-bold text-slate-700">{block.rowCount}R × {block.seatsPerRow}C</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">Tariff</span>
                            <span className="font-bold text-indigo-700">₹{block.basePrice}</span>
                          </div>
                        </div>

                        {block.hasBalconyRailing && (
                          <div className="mt-2 text-[10px] font-mono font-semibold text-amber-800 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                            <span>══</span>
                            <span>Balcony Safety Railing Enabled</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Full Visual Seating Layout Plan */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Architectural Seating Plan & Visual Stage Blueprint
                    </h3>
                    <p className="text-xs text-slate-500">
                      Click on any seat to inspect attendee allocations, prices, or change status.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>Print Chart</span>
                    </button>
                  </div>
                </div>

                <AuditoriumSeatingLayout
                  auditorium={currentAuditorium}
                  seats={currentSeats}
                  onSeatClick={seat => setInspectingSeat(seat)}
                  selectedSeatId={inspectingSeat?.id || null}
                  onEditBlock={block => setEditingBlock(block)}
                  onAddBlockClick={() => setIsAddBlockOpen(true)}
                  onBulkBlockAction={handleBulkBlockAction}
                />
              </div>
            </div>
          )}

          {/* Tab 2: Facility Amenities & Stage Specs */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stage Rigging & Acoustics */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Stage & Audiovisual Infrastructure</span>
                  </h3>
                  
                  <div className="space-y-2 text-xs">
                    {currentAuditorium.facilities.map((fac, i) => (
                      <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 text-slate-800 font-medium">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1.5 text-xs">
                    <span className="font-bold text-indigo-900 block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Acoustic Engineering Profile
                    </span>
                    <p className="text-indigo-800 text-[11px] leading-relaxed">
                      {currentAuditorium.acousticRating || 'ISO 3382 certified acoustic chamber with tuned wall diffusers.'}
                    </p>
                  </div>

                  {currentAuditorium.lightingSystem && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                      <span className="font-bold text-slate-900 block mb-1">Lighting & Rigging:</span>
                      <span>{currentAuditorium.lightingSystem}</span>
                    </div>
                  )}
                </div>

                {/* Weather & Open-Air Architecture (or Indoor Stage Specs) */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    {isOpenTheatre ? <Sun className="w-3.5 h-3.5 text-amber-600" /> : <Building2 className="w-3.5 h-3.5 text-indigo-600" />}
                    <span>{isOpenTheatre ? 'Open Theatre & Climate Systems' : 'Auditorium Proscenium Specs'}</span>
                  </h3>

                  {isOpenTheatre ? (
                    <div className="space-y-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                        <div className="flex items-center gap-2 text-amber-900 font-bold">
                          <Sun className="w-4 h-4 text-amber-600" />
                          <span>Sunlight & Orientation Profile</span>
                        </div>
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          {currentAuditorium.weatherContingency?.sunsetOrientation || 'Natural sunset amphitheatre facing North-West.'}
                        </p>
                      </div>

                      <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                        currentAuditorium.weatherContingency?.hasRetractableCanopy
                          ? 'bg-sky-50/80 border-sky-200 text-sky-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5">
                            <CloudRain className="w-4 h-4 text-sky-600" />
                            Retractable Rain Canopy
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            currentAuditorium.weatherContingency?.hasRetractableCanopy
                              ? 'bg-sky-200 text-sky-900'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {currentAuditorium.weatherContingency?.hasRetractableCanopy ? 'Motorized Active' : 'Uncovered OAT'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {currentAuditorium.weatherContingency?.hasRetractableCanopy 
                            ? 'Teflon-coated acoustic fabric deploys in 4.5 minutes during sudden rainfall.'
                            : 'Open-air venue subject to clear weather conditions.'}
                        </p>
                      </div>

                      {currentAuditorium.weatherContingency?.rainFallbackVenue && (
                        <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900">
                          <span className="font-bold block text-[10px] uppercase text-purple-700 mb-0.5">Automated Monsoon Contingency</span>
                          <span>Rain Fallback Venue: <strong>{currentAuditorium.weatherContingency.rainFallbackVenue}</strong></span>
                        </div>
                      )}

                      {currentAuditorium.lawnCapacity && currentAuditorium.lawnCapacity > 0 && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-medium">
                            <TreePine className="w-3.5 h-3.5 text-emerald-600" />
                            Unreserved Lawn Blanket Mound
                          </span>
                          <span className="font-bold font-mono">+{currentAuditorium.lawnCapacity} pax</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
                        <span className="font-bold text-indigo-900 block">Proscenium Stage & Fly Tower</span>
                        <p className="text-[11px] text-indigo-800 leading-relaxed">
                          Motorized fly bars with 12 motorized hoists, counterweight system, and fire safety isolation curtain.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-700">
                        <span className="font-bold text-slate-900 block">Orchestra Pit & Elevators:</span>
                        <span>Hydraulic orchestra lift accommodating up to 25 musicians.</span>
                      </div>
                    </div>
                  )}

                  {/* Dimensions & Permits Details */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <span className="font-bold text-slate-800 block">Structural Geometry & Permits</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                      <div>Stage Blueprint: <strong>{currentAuditorium.stageDimensions}</strong></div>
                      <div>Permit Code: <strong>{currentAuditorium.code}</strong></div>
                      <div>Green Rooms: <strong>{currentAuditorium.greenRoomsCount || 2} Air-conditioned</strong></div>
                      <div>Topology: <strong>{currentAuditorium.seatingTopology === 'radial_arc' ? 'Concentric Radial (r, θ)' : 'Proscenium Cartesian'}</strong></div>
                    </div>
                  </div>
                </div>

                {/* Statutory Regulations & Booking Policy */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Civic Regulations & Tariffs</span>
                  </h3>
                  
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <span className="font-bold text-slate-900 block">Civic Usage Rules</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {currentAuditorium.rules}
                    </p>
                  </div>

                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                    <span className="font-bold block flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      Sound Decibel Protocol
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      {isOpenTheatre
                        ? 'Outdoor amplification cutoff strictly at 10:00 PM per municipal noise containment codes. Live acoustic instruments permitted until 11:00 PM.'
                        : 'Indoor acoustic chamber attenuation allows late-night productions with prior management committee clearance.'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <span className="font-bold text-slate-900 block">Commercial Booking Tariffs</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                      <div>Base Tariff: <strong className="text-indigo-700 font-bold">₹{currentAuditorium.hourlyRate}/hr</strong></div>
                      <div>Min Booking: <strong>{currentAuditorium.minBookingHours || 2} Hours</strong></div>
                      <div>Security Deposit: <strong>₹{currentAuditorium.securityDeposit ? currentAuditorium.securityDeposit.toLocaleString() : '15,000'}</strong></div>
                      <div>Power Backup: <strong>Dual 125 kVA DG</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Hall Bookings & Civic Protocol */}
          {activeTab === 'schedule' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Upcoming Auditorium Engagements</h3>
                  <p className="text-xs text-slate-500">Scheduled events and rehearsals inside {currentAuditorium.name}</p>
                </div>
                {onBookAuditorium && (
                  <button
                    onClick={onBookAuditorium}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Facility Slot</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: 'Diwali Grand Cultural Gala 2026',
                    date: '28 Oct 2026',
                    time: '06:00 PM - 10:00 PM',
                    organizer: 'Cultural Sub-Committee',
                    allocatedSeats: `${totalConfiguredSeats} (Full Auditorium + Balcony)`,
                    status: 'Confirmed'
                  },
                  {
                    title: 'Classical Sitar & Tabla Jugalbandi Recital',
                    date: '04 Nov 2026',
                    time: '05:30 PM - 08:30 PM',
                    organizer: 'Music Lovers Guild',
                    allocatedSeats: `${floorBlocks.reduce((s, b) => s + b.totalSeats, 0)} (Floor Stalls Only)`,
                    status: 'Tech Rehearsal'
                  },
                  {
                    title: 'Annual General Body Statutory Assembly (AGM)',
                    date: '15 Nov 2026',
                    time: '09:30 AM - 01:30 PM',
                    organizer: 'Managing Executive Committee',
                    allocatedSeats: `${totalConfiguredSeats} (Floor + Balcony Quorum)`,
                    status: 'Official Notice'
                  }
                ].map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{ev.title}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-slate-500 mt-1">
                        <span>{ev.date} • {ev.time}</span>
                        <span>•</span>
                        <span>Lead: {ev.organizer}</span>
                        <span>•</span>
                        <span className="font-semibold text-indigo-700">{ev.allocatedSeats}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {ev.status}
                      </span>
                      {onOpenSeatMap && (
                        <button
                          onClick={onOpenSeatMap}
                          className="px-2.5 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200 transition"
                        >
                          Seat Map
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {currentAuditorium && (
        <>
          {/* 1. Add Seat Block Modal */}
          <AddSeatBlockModal
            isOpen={isAddBlockOpen}
            onClose={() => setIsAddBlockOpen(false)}
            auditorium={currentAuditorium}
            onAddBlock={handleAddBlock}
          />

          {/* 2. Edit Seat Block Modal */}
          <EditSeatBlockModal
            isOpen={!!editingBlock}
            onClose={() => setEditingBlock(null)}
            block={editingBlock}
            onUpdateBlock={handleUpdateBlock}
            onDeleteBlock={handleDeleteBlock}
          />

          {/* 3. Seat Inspector Modal */}
          <SeatInspectorModal
            isOpen={!!inspectingSeat}
            onClose={() => setInspectingSeat(null)}
            seat={inspectingSeat}
            onUpdateSeat={handleUpdateSeat}
          />
        </>
      )}

      {/* 4. Create Venue Modal */}
      <CreateVenueModal
        isOpen={isNewVenueModalOpen}
        onClose={() => setIsNewVenueModalOpen(false)}
        existingVenues={auditoriums}
        onCreateVenue={handleCreateVenue}
      />
    </div>
  );
};
