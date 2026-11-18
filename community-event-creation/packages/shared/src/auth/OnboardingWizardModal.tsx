import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Briefcase, 
  GraduationCap, 
  Home, 
  Award, 
  Palette, 
  Trophy, 
  Users2, 
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Layers,
  Globe,
  CheckCircle2,
  Calendar,
  Lock,
  Zap,
  Theater,
  HelpCircle
} from 'lucide-react';
import { CommunitySector, OnboardingFormState, OrganizationConfig } from '../types/onboarding';
import { SECTOR_DEFINITIONS, SUBSCRIPTION_PLANS, INITIAL_SECTOR_ORGS } from '../data/sectorPresets';
import { NavItemKey } from '../types';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (newOrg: OrganizationConfig) => void;
  initialSector?: CommunitySector;
}

const SECTOR_ICONS: Record<CommunitySector, React.ElementType> = {
  'professional-business': Briefcase,
  'education-learning': GraduationCap,
  'residential-local': Home,
  'customer-brand': Award,
  'interest-hobby': Palette,
  'sports-fitness': Trophy,
  'social-networking': Users2,
  'non-profit-orgs': HeartHandshake
};

const ALL_MODULE_OPTIONS: { key: NavItemKey; label: string; desc: string }[] = [
  { key: 'auditoriums', label: 'Auditoriums & Seating Tiers', desc: 'Stage design, proscenium, elevated balcony blocks, seat inspector' },
  { key: 'facility-bookings', label: 'Amenity & Space Reservations', desc: 'Time-slots, hourly booking rules, approvals and check-ins' },
  { key: 'events', label: 'Events & Ticketing', desc: 'Conferences, matches, galas, seminars, QR badge verification' },
  { key: 'payments', label: 'Financial Ledgers & Collections', desc: 'UPI, credit cards, automated reconciliation, bank statements' },
  { key: 'invoices', label: 'Automated Tax Invoices & Statements', desc: 'Recurring dues, facility charges, GST/tax breakdowns' },
  { key: 'polls', label: 'Polls & Democratic Voting', desc: 'Resolution balloting, surveys, committee elections' },
  { key: 'volunteers', label: 'Volunteer Stewardship', desc: 'Task forces, shift hours tracking, service logs' },
  { key: 'food-programs', label: 'Dining & Food Programs', desc: 'Banquets, food drives, token verification' },
  { key: 'announcements', label: 'Announcements & Broadcasts', desc: 'Official notices, push alerts, newsletters' },
  { key: 'reports', label: 'Compliance Reports & Analytics', desc: 'Audit-ready PDFs, occupancy heatmaps, velocity stats' }
];

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialSector = 'professional-business'
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  const defaultSectorDef = SECTOR_DEFINITIONS[initialSector];

  const [form, setForm] = useState<OnboardingFormState>({
    adminName: 'Rajesh Sharma',
    adminEmail: 'admin@comm-unity.app',
    adminPhone: '+1 (555) 234-5678',
    adminPassword: 'Password123!',
    adminRoleTitle: 'Organization Director / Super Admin',

    selectedSector: initialSector,

    orgName: defaultSectorDef.defaultSampleOrgName,
    orgSlug: defaultSectorDef.defaultSampleOrgName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 24),
    city: defaultSectorDef.defaultSampleCity.split(',')[0].trim(),
    country: 'United States',
    memberCountRange: '501 - 1,500',
    customMemberSingular: defaultSectorDef.memberTerm.singular,
    customMemberPlural: defaultSectorDef.memberTerm.plural,
    customSpaceSingular: defaultSectorDef.spaceTerm.singular,
    customSpacePlural: defaultSectorDef.spaceTerm.plural,
    accessPolicy: 'approval_required',
    allowedDomain: '',

    enabledModules: [...defaultSectorDef.keyModules],
    primaryAuditoriumTitle: defaultSectorDef.primaryAuditoriumName,
    initialFacilityName: defaultSectorDef.defaultFacilities[0] || 'Main Hall',

    selectedPlanId: 'growth',
    billingCycle: 'annual',
    cardName: 'Rajesh Sharma',
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '•••',
    isTrial: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const activeSectorDef = SECTOR_DEFINITIONS[form.selectedSector];
  const activePlan = SUBSCRIPTION_PLANS.find(p => p.id === form.selectedPlanId) || SUBSCRIPTION_PLANS[1];

  const handleSelectSector = (sectorKey: CommunitySector) => {
    const sDef = SECTOR_DEFINITIONS[sectorKey];
    setForm(prev => ({
      ...prev,
      selectedSector: sectorKey,
      orgName: sDef.defaultSampleOrgName,
      orgSlug: sDef.defaultSampleOrgName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 24),
      city: sDef.defaultSampleCity.split(',')[0].trim(),
      customMemberSingular: sDef.memberTerm.singular,
      customMemberPlural: sDef.memberTerm.plural,
      customSpaceSingular: sDef.spaceTerm.singular,
      customSpacePlural: sDef.spaceTerm.plural,
      primaryAuditoriumTitle: sDef.primaryAuditoriumName,
      initialFacilityName: sDef.defaultFacilities[0] || 'Main Space',
      enabledModules: [...sDef.keyModules]
    }));
  };

  const handleToggleModule = (key: NavItemKey) => {
    setForm(prev => {
      const exists = prev.enabledModules.includes(key);
      if (exists) {
        if (key === 'dashboard' || key === 'members') return prev; // Mandatory core
        return { ...prev, enabledModules: prev.enabledModules.filter(m => m !== key) };
      } else {
        return { ...prev, enabledModules: [...prev.enabledModules, key] };
      }
    });
  };

  const handleFinishOnboarding = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const calculatedAmount = form.billingCycle === 'annual' 
        ? activePlan.annualPrice * 12 
        : activePlan.monthlyPrice;

      const newOrg: OrganizationConfig = {
        id: `org-${Date.now().toString(36)}`,
        name: form.orgName.trim() || activeSectorDef.defaultSampleOrgName,
        slug: form.orgSlug.trim() || 'my-community',
        sector: form.selectedSector,
        memberTermSingular: form.customMemberSingular.trim() || activeSectorDef.memberTerm.singular,
        memberTermPlural: form.customMemberPlural.trim() || activeSectorDef.memberTerm.plural,
        spaceTermSingular: form.customSpaceSingular.trim() || activeSectorDef.spaceTerm.singular,
        spaceTermPlural: form.customSpacePlural.trim() || activeSectorDef.spaceTerm.plural,
        city: form.city.trim() || 'New York',
        country: form.country.trim() || 'United States',
        contactEmail: form.adminEmail.trim() || 'admin@comm-unity.app',
        contactPhone: form.adminPhone.trim() || '+1 (555) 234-5678',
        accessPolicy: form.accessPolicy,
        allowedDomain: form.allowedDomain,
        memberCountRange: form.memberCountRange,
        enabledModules: form.enabledModules,
        subscription: {
          planId: form.selectedPlanId,
          billingCycle: form.billingCycle,
          amount: calculatedAmount,
          currency: 'USD ($)',
          status: form.isTrial ? 'trial' : 'active',
          startDate: 'Today',
          nextBillingDate: form.isTrial ? '14 Days from today' : (form.billingCycle === 'annual' ? '1 Year from today' : '1 Month from today'),
          paymentMethod: `Credit Card (Visa ending in 4242)`
        },
        primaryAdmin: {
          name: form.adminName.trim() || 'Super Admin',
          email: form.adminEmail.trim() || 'admin@comm-unity.app',
          roleTitle: form.adminRoleTitle.trim() || 'Organization Director',
          phone: form.adminPhone.trim() || '+1 (555) 234-5678'
        }
      };

      setIsSubmitting(false);
      onComplete(newOrg);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight flex items-center gap-2">
                <span>CommUnity Organization Setup</span>
                <span className="text-[11px] font-medium text-indigo-400">· Multi-Sector Engine</span>
              </div>
              <p className="text-xs text-slate-400">
                Configure your sector archetype, tailored terminology, facility rules & subscription plan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Step {currentStep} of {totalSteps}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close wizard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 shrink-0 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[620px] text-xs font-semibold">
            {[
              { num: 1, label: '01. Admin Identity' },
              { num: 2, label: '02. Sector Archetype' },
              { num: 3, label: '03. Org & Terms' },
              { num: 4, label: '04. Modules & Space' },
              { num: 5, label: '05. Subscription' },
              { num: 6, label: '06. Launch Ready' }
            ].map((st) => {
              const isPast = currentStep > st.num;
              const isCurrent = currentStep === st.num;
              return (
                <div 
                  key={st.num}
                  onClick={() => {
                    if (isPast) setCurrentStep(st.num);
                  }}
                  className={`flex items-center gap-2 cursor-pointer transition ${
                    isCurrent 
                      ? 'text-indigo-600 font-bold' 
                      : isPast 
                        ? 'text-slate-700 hover:text-slate-900' 
                        : 'text-slate-400 pointer-events-none'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : isPast 
                        ? 'bg-slate-200 text-slate-800' 
                        : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isPast ? <Check className="w-3 h-3" /> : st.num}
                  </div>
                  <span>{st.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Body with Split View */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form Step Content (8 cols on large) */}
          <div className="lg:col-span-8 space-y-6">

            {/* STEP 1: Admin Account */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">01. Super Admin Account Setup</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    This account will hold omni-administrative permissions to invite coordinators, manage billing, and govern the portal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={form.adminName}
                      onChange={e => setForm({ ...form, adminName: e.target.value })}
                      placeholder="e.g. Rajesh Sharma / Elena Rostova"
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Work / Primary Email</label>
                    <input
                      type="email"
                      value={form.adminEmail}
                      onChange={e => setForm({ ...form, adminEmail: e.target.value })}
                      placeholder="e.g. president@greenwood.org"
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Direct Phone / Mobile</label>
                    <input
                      type="tel"
                      value={form.adminPhone}
                      onChange={e => setForm({ ...form, adminPhone: e.target.value })}
                      placeholder="+1 (555) 234-5678"
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Administrative Role Title</label>
                    <input
                      type="text"
                      value={form.adminRoleTitle}
                      onChange={e => setForm({ ...form, adminRoleTitle: e.target.value })}
                      placeholder="e.g. Managing Committee President / Director"
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={form.adminPassword}
                        onChange={e => setForm({ ...form, adminPassword: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden"
                      />
                      <span className="absolute right-3 top-2.5 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> High Security
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Enforced 12-char passphrase with two-factor authentication (2FA) support.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Multi-Tenant Tenant Isolation:</span> Your organization's data, member directory, and financial transactions are cryptographically isolated with dedicated tenant encryption keys.
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Sector Archetype Selection */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">02. Select Community & Organization Sector</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose from 8 purpose-tailored verticals. The platform dynamically recalibrates member terminology, facility blueprints, and governance tools.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.keys(SECTOR_DEFINITIONS) as CommunitySector[]).map((secKey) => {
                    const sec = SECTOR_DEFINITIONS[secKey];
                    const IconComponent = SECTOR_ICONS[secKey] || Building2;
                    const isSelected = form.selectedSector === secKey;

                    return (
                      <div
                        key={secKey}
                        onClick={() => handleSelectSector(secKey)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                              }`}>
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900">{sec.name}</h4>
                                <span className="text-[10px] text-slate-500">{sec.categoryTag}</span>
                              </div>
                            </div>

                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5" />}
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-3">
                            {sec.description}
                          </p>
                        </div>

                        {/* Unboxed Metadata Discipline */}
                        <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2 text-[10px] text-slate-500">
                          <span>Members: <strong className="text-slate-700">{sec.memberTerm.plural}</strong></span>
                          <span>·</span>
                          <span>Spaces: <strong className="text-slate-700">{sec.spaceTerm.plural}</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: Org Details & Terminology */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">03. Organization Profile & Custom Terminology</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customize your community branding, public vanity slug, and localized terms for members and units.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Organization / Community Legal Name</label>
                    <input
                      type="text"
                      value={form.orgName}
                      onChange={e => {
                        const newName = e.target.value;
                        const autoSlug = newName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 24);
                        setForm({ ...form, orgName: newName, orgSlug: autoSlug });
                      }}
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Vanity Subdomain / Slug</label>
                    <div className="flex items-center">
                      <span className="p-2.5 bg-slate-100 border border-r-0 border-slate-200 text-slate-500 rounded-l-lg text-[11px]">
                        comm-unity.app/c/
                      </span>
                      <input
                        type="text"
                        value={form.orgSlug}
                        onChange={e => setForm({ ...form, orgSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        className="w-full p-2.5 border border-slate-200 rounded-r-lg focus:border-indigo-500 focus:outline-hidden font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Estimated Member Scale</label>
                    <select
                      value={form.memberCountRange}
                      onChange={e => setForm({ ...form, memberCountRange: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden"
                    >
                      <option value="1 - 100">1 - 100 Members (Micro / Club)</option>
                      <option value="101 - 500">101 - 500 Members (Standard Association)</option>
                      <option value="501 - 1,500">501 - 1,500 Members (Active Township / Academy)</option>
                      <option value="1,501 - 2,500">1,501 - 2,500 Members (Large Campus)</option>
                      <option value="2,500+">2,500+ Members (Enterprise)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Headquarters City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Austin, TX"
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Member Join Policy</label>
                    <select
                      value={form.accessPolicy}
                      onChange={e => setForm({ ...form, accessPolicy: e.target.value as any })}
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden"
                    >
                      <option value="approval_required">Self-Registration with Admin Approval (Recommended)</option>
                      <option value="open">Open Self-Registration (Instant Access)</option>
                      <option value="domain_restricted">Restricted to Official Email Domain (@campus.edu)</option>
                    </select>
                  </div>
                </div>

                {/* Terminology Recalibration Section */}
                <div className="pt-3 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 mb-2">Tailored Domain Terminology</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Member (Singular)</label>
                      <input
                        type="text"
                        value={form.customMemberSingular}
                        onChange={e => setForm({ ...form, customMemberSingular: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-md focus:border-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Members (Plural)</label>
                      <input
                        type="text"
                        value={form.customMemberPlural}
                        onChange={e => setForm({ ...form, customMemberPlural: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-md focus:border-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Unit / Space (Singular)</label>
                      <input
                        type="text"
                        value={form.customSpaceSingular}
                        onChange={e => setForm({ ...form, customSpaceSingular: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-md focus:border-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Units / Spaces (Plural)</label>
                      <input
                        type="text"
                        value={form.customSpacePlural}
                        onChange={e => setForm({ ...form, customSpacePlural: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-md focus:border-indigo-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Modules & Facilities */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">04. Activate Modules & Facility Spaces</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Toggle capabilities required for your operations. All modules are pre-aligned to your {activeSectorDef.name} archetype.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {ALL_MODULE_OPTIONS.map((mod) => {
                    const isChecked = form.enabledModules.includes(mod.key);
                    const isMandatory = mod.key === 'auditoriums';

                    return (
                      <div
                        key={mod.key}
                        onClick={() => handleToggleModule(mod.key)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                          isChecked 
                            ? 'border-indigo-600 bg-indigo-50/30' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="pr-2">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{mod.label}</span>
                            {isMandatory && (
                              <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {mod.desc}
                          </p>
                        </div>

                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                          isChecked ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Primary Seating Space Setup */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Theater className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-bold text-slate-900">Default Auditorium / Hall Blueprint</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Auditorium / Hall Name</label>
                      <input
                        type="text"
                        value={form.primaryAuditoriumTitle}
                        onChange={e => setForm({ ...form, primaryAuditoriumTitle: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Initial Architectural Seating Preset</label>
                      <select className="w-full p-2 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden bg-white text-slate-700">
                        <option>Stalls Floor (A-H) + Elevated Balcony Tier 1 & 2 (850 Seats)</option>
                        <option>Executive Amphitheatre + VIP Boxes (450 Seats)</option>
                        <option>Stadium Grandstand + Mezzanine Overhang (750 Seats)</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Includes motorized curtain proscenium stage, acoustic baffles, and the custom seat block manager.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 5: Subscription Plan Selection & Checkout */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">05. Subscription Plan & Billing</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Transparent pricing with zero hidden fees. Includes 14-day zero-risk trial.
                    </p>
                  </div>

                  {/* Monthly / Annual Toggle */}
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, billingCycle: 'monthly' })}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                        form.billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, billingCycle: 'annual' })}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                        form.billingCycle === 'annual' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>Annual</span>
                      <span className="text-[10px] bg-white/20 px-1 rounded">Save 20%</span>
                    </button>
                  </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SUBSCRIPTION_PLANS.map((plan) => {
                    const isSelected = form.selectedPlanId === plan.id;
                    const price = form.billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

                    return (
                      <div
                        key={plan.id}
                        onClick={() => setForm({ ...form, selectedPlanId: plan.id })}
                        className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition relative ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {plan.isPopular && (
                          <div className="absolute -top-2.5 right-3 bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Recommended
                          </div>
                        )}

                        <div>
                          <div className="text-xs font-bold text-slate-900">{plan.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{plan.tierTag}</div>

                          <div className="my-3 flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-900 tabular-nums">${price}</span>
                            <span className="text-xs text-slate-500">/ month</span>
                          </div>

                          <div className="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                            <div className="font-semibold text-slate-800">{plan.memberLimit}</div>
                            <div>{plan.auditoriumLimit}</div>
                            <div>{plan.spaceLimit}</div>
                            <div>{plan.storage}</div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <button
                            type="button"
                            className={`w-full py-1.5 rounded-lg text-xs font-bold transition ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select Plan'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Simulated Payment Details */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-bold text-slate-900">Payment & Trial Activation</h4>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      14-Day Free Trial (Cancel Anytime)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-600 text-[11px] mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={form.cardName}
                        onChange={e => setForm({ ...form, cardName: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white focus:border-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Card Number</label>
                      <input
                        type="text"
                        value={form.cardNumber}
                        readOnly
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 font-mono text-[11px]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-1/2">
                        <label className="block text-slate-600 text-[11px] mb-1">Expires</label>
                        <input
                          type="text"
                          value={form.cardExpiry}
                          readOnly
                          className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 text-center font-mono text-[11px]"
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="block text-slate-600 text-[11px] mb-1">CVC</label>
                        <input
                          type="text"
                          value={form.cardCvc}
                          readOnly
                          className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 text-center font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Launch Ready */}
            {currentStep === 6 && (
              <div className="space-y-5 text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">Your Organization Is Configured & Ready!</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    We have successfully initialized <strong className="text-slate-800">{form.orgName}</strong> with full {activeSectorDef.name} modules and {activePlan.name} allowances.
                  </p>
                </div>

                {/* Provisioning Summary Card */}
                <div className="max-w-lg mx-auto bg-slate-50 rounded-xl border border-slate-200 p-4 text-left text-xs space-y-2.5">
                  <div className="flex justify-between pb-2 border-b border-slate-200 text-slate-600">
                    <span>Portal URL:</span>
                    <strong className="text-indigo-600 font-mono">comm-unity.app/c/{form.orgSlug}</strong>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200 text-slate-600">
                    <span>Sector Archetype:</span>
                    <strong className="text-slate-900">{activeSectorDef.name}</strong>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200 text-slate-600">
                    <span>Primary Admin:</span>
                    <strong className="text-slate-900">{form.adminName} ({form.adminEmail})</strong>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200 text-slate-600">
                    <span>Active Subscription:</span>
                    <strong className="text-slate-900">{activePlan.name} · {form.billingCycle.toUpperCase()} ($14-Day Trial)</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Member Registration URL:</span>
                    <strong className="text-emerald-700 font-mono">comm-unity.app/c/{form.orgSlug}/register</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleFinishOnboarding}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg transition"
                  >
                    <span>{isSubmitting ? 'Provisioning Workspace...' : 'Launch Operations Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Live Workspace Snapshot (4 cols on large) */}
          <div className="lg:col-span-4 bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Live Snapshot Preview
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              {/* Dynamic Org Card */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs">
                    {form.orgName.charAt(0) || 'C'}
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {form.orgName || 'Your Organization'}
                    </h4>
                    <span className="text-[10px] text-indigo-600 font-semibold block">
                      {activeSectorDef.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {form.city || 'City'}, {form.country}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Members Term:</span>
                    <strong className="text-slate-800">{form.customMemberPlural}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Units / Spaces:</span>
                    <strong className="text-slate-800">{form.customSpacePlural}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Scale:</span>
                    <span className="text-slate-800">{form.memberCountRange}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Plan:</span>
                    <strong className="text-indigo-600">{activePlan.name}</strong>
                  </div>
                </div>
              </div>

              {/* Blueprint Amenities */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-700">Pre-Configured Facilities:</div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="p-2 bg-white rounded-lg border border-slate-200/70 truncate flex items-center gap-1.5">
                    <Theater className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{form.primaryAuditoriumTitle}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/70 truncate flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{activeSectorDef.defaultFacilities[0]}</span>
                  </div>
                </div>
              </div>

              {/* Active Modules Counter */}
              <div className="p-3 bg-white rounded-lg border border-slate-200/70 text-[11px] text-slate-600">
                <div className="flex justify-between font-semibold text-slate-800 mb-1">
                  <span>Activated Modules</span>
                  <span>{form.enabledModules.length} Active</span>
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-2">
                  Auditoriums, Seat Balconies, Bookings, Events, Ledgers, Polls & Broadcasts.
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>SOC-2 & GDPR Multi-Tenant Certified</span>
            </div>
          </div>

        </div>

        {/* Footer Navigation Bar */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => {
              if (currentStep > 1) setCurrentStep(currentStep - 1);
            }}
            disabled={currentStep === 1 || currentStep === 6}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition ${
              currentStep === 1 || currentStep === 6
                ? 'text-slate-300 pointer-events-none'
                : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep < 5 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {currentStep === 5 && (
              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
              >
                <span>Confirm & Activate 14-Day Trial</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            )}

            {currentStep === 6 && (
              <button
                type="button"
                onClick={handleFinishOnboarding}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-6 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
              >
                <span>{isSubmitting ? 'Launching...' : 'Open Workspace'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
