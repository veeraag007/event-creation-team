import React, { useState } from 'react';
import { 
  Building2, 
  ArrowRight,
  Briefcase,
  GraduationCap,
  Home,
  Award,
  Palette,
  Trophy,
  Users2,
  HeartHandshake,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Role, UserProfile } from '../types';
import { CommunitySector, OrganizationConfig } from '../types/onboarding';
import { SECTOR_DEFINITIONS, INITIAL_SECTOR_ORGS } from '../data/sectorPresets';

interface LoginViewProps {
  onLogin: (profile: UserProfile, org?: OrganizationConfig) => void;
  onOpenOnboarding: (sector?: CommunitySector) => void;
  /** Micro-app name shown in the header, e.g. "Event Creation". */
  appName?: string;
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

export const LoginView: React.FC<LoginViewProps> = ({ 
  onLogin,
  onOpenOnboarding,
  appName
}) => {
  const [activeSector, setActiveSector] = useState<CommunitySector>('professional-business');

  const sectorDef = SECTOR_DEFINITIONS[activeSector];
  const sectorOrg = INITIAL_SECTOR_ORGS[activeSector];

  const handleLaunchPreset = () => {
    const profile: UserProfile = {
      id: `usr-${activeSector}`,
      name: sectorOrg.primaryAdmin.name,
      email: sectorOrg.primaryAdmin.email,
      role: 'Super Admin',
      community: sectorOrg.name,
      avatar: sectorOrg.primaryAdmin.name.split(' ').map(n => n[0]).join('').slice(0, 2)
    };
    onLogin(profile, sectorOrg);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
            C
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block">CommUnity 360</span>
            <span className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider block">
              {appName ?? 'Multi-Sector Operations Platform'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenOnboarding()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Self-Register / Onboard Organization</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Pitch & Sector Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Adaptive Multi-Sector Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              One Unified SaaS for Every Community Vertical
            </h1>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              From academic universities and corporate tech hubs to residential townships, sports complexes, and humanitarian foundations. Tailored terminology, multi-tier balcony seat layouts, and automated subscription billing.
            </p>
          </div>

          {/* Sector Selector Grid */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Choose a Sector Archetype to Preview:</span>
              <span className="text-indigo-400 font-semibold">{sectorDef.name}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(SECTOR_DEFINITIONS) as CommunitySector[]).map((secKey) => {
                const sec = SECTOR_DEFINITIONS[secKey];
                const IconComponent = SECTOR_ICONS[secKey] || Building2;
                const isSelected = activeSector === secKey;

                return (
                  <button
                    key={secKey}
                    type="button"
                    onClick={() => setActiveSector(secKey)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-950/60 ring-1 ring-indigo-500 text-white shadow-md' 
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">{sec.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate">{sec.categoryTag}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-tier Balcony Seating
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sector Terminology Engine
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> B2B2C Member Registration
            </span>
          </div>
        </div>

        {/* Right Card: Instant Launch & Credentials (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold text-lg">
                  {sectorOrg.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{sectorOrg.name}</h3>
                  <div className="text-xs text-indigo-400 font-semibold">{sectorDef.name}</div>
                  <div className="text-[11px] text-slate-500">{sectorOrg.city}, {sectorOrg.country}</div>
                </div>
              </div>
            </div>

            {/* Terminology and Defaults Showcase */}
            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Member Entity:</span>
                <strong className="text-slate-200">{sectorOrg.memberTermPlural}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Unit / Space Entity:</span>
                <strong className="text-slate-200">{sectorOrg.spaceTermPlural}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Primary Auditorium:</span>
                <strong className="text-slate-200 truncate max-w-[200px] text-right">{sectorDef.primaryAuditoriumName}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Active Subscription:</span>
                <strong className="text-emerald-400 font-semibold uppercase">{sectorOrg.subscription.planId} · {sectorOrg.subscription.billingCycle}</strong>
              </div>
            </div>

            {/* Admin Profile Box */}
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Super Admin</div>
                <div className="font-bold text-white mt-0.5">{sectorOrg.primaryAdmin.name}</div>
                <div className="text-[11px] text-slate-400">{sectorOrg.primaryAdmin.roleTitle}</div>
              </div>
              <span className="px-2 py-1 bg-indigo-900/60 text-indigo-300 text-[10px] font-bold rounded-md border border-indigo-700">
                Super Admin
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleLaunchPreset}
                className="w-full py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Enter Workspace as {sectorOrg.primaryAdmin.name.split(' ')[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenOnboarding(activeSector)}
                className="w-full py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Run Full Onboarding Wizard for this Sector</span>
              </button>
            </div>

            <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Isolated Multi-Tenant Security · Real-time Billing Engine</span>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto py-4 text-center text-xs text-slate-500 border-t border-slate-800/80">
        CommUnity Admin SaaS · 8 Industry Archetypes Supported · Professional · Education · Residential · Brand · Hobby · Sports · Social · Non-Profit
      </footer>
    </div>
  );
};
