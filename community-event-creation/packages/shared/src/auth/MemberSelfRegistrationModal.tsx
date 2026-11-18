import React, { useState } from 'react';
import { X, Check, UserPlus, ShieldCheck, ArrowRight, Building2 } from 'lucide-react';
import { OrganizationConfig, CommunitySector } from '../types/onboarding';
import { SECTOR_DEFINITIONS } from '../data/sectorPresets';
import { Member } from '../types';

interface MemberSelfRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationConfig;
  onRegisterMember: (newMember: Member) => void;
}

export const MemberSelfRegistrationModal: React.FC<MemberSelfRegistrationModalProps> = ({
  isOpen,
  onClose,
  organization,
  onRegisterMember
}) => {
  const sectorDef = SECTOR_DEFINITIONS[organization.sector] || SECTOR_DEFINITIONS['residential-local'];

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [professionOrDept, setProfessionOrDept] = useState('');
  const [unitOrSpace, setUnitOrSpace] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [membershipType, setMembershipType] = useState<Member['membershipType']>('Standard');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const newMemberId = `MEM-${Math.floor(10000 + Math.random() * 90000)}`;
    const createdMember: Member = {
      id: `m-${Date.now()}`,
      memberId: newMemberId,
      name: fullName,
      email,
      phone: phone || '+1 (555) 000-0000',
      membershipType,
      status: organization.accessPolicy === 'open' ? 'active' : 'pending',
      familyMembersCount: 1,
      joinedDate: 'Today',
      expiryDate: '31 Dec 2027',
      lastActivity: 'Just registered',
      location: unitOrSpace || `${organization.spaceTermSingular} A-101`,
      profession: professionOrDept || 'Registered Member',
      emergencyContact: emergencyContact || 'None listed',
      bookingsCount: 0
    };

    onRegisterMember(createdMember);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                {organization.name}
              </h3>
              <p className="text-xs text-slate-400">
                Self-Registration for {organization.memberTermPlural}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Registration Submitted!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {organization.accessPolicy === 'open' 
                  ? `Your account has been activated immediately. You now have full member access to ${organization.name}.`
                  : `Your application has been logged for review by the ${organization.name} admin team. You will receive an approval notification shortly.`}
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
              <span className="font-semibold text-slate-800">Sector Context:</span> {sectorDef.name} ({sectorDef.categoryTag})
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Maya Lin / David Chen"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {organization.spaceTermSingular} (Allocation)
                </label>
                <input
                  type="text"
                  value={unitOrSpace}
                  onChange={e => setUnitOrSpace(e.target.value)}
                  placeholder={`e.g. ${organization.spaceTermSingular} #204`}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {sectorDef.sampleCustomFields[0]?.label || 'Identifier'}
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder={sectorDef.sampleCustomFields[0]?.placeholder || 'Reference ID'}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Profession / Role</label>
                <input
                  type="text"
                  value={professionOrDept}
                  onChange={e => setProfessionOrDept(e.target.value)}
                  placeholder="e.g. Software Engineer / Lead Violinist"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Membership Plan</label>
                <select
                  value={membershipType}
                  onChange={e => setMembershipType(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value="Standard">Standard {organization.memberTermSingular}</option>
                  <option value="Premium">Premium Access Tier</option>
                  <option value="Life">Life / Honorary Fellow</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={e => setEmergencyContact(e.target.value)}
                  placeholder="Name and Phone Number"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition"
              >
                <span>Submit Registration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
