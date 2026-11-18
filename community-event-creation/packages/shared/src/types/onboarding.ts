import { NavItemKey } from './index';

export type CommunitySector = 
  | 'professional-business'
  | 'education-learning'
  | 'residential-local'
  | 'customer-brand'
  | 'interest-hobby'
  | 'sports-fitness'
  | 'social-networking'
  | 'non-profit-orgs';

export interface SectorDefinition {
  id: CommunitySector;
  name: string;
  categoryTag: string;
  tagline: string;
  description: string;
  memberTerm: {
    singular: string;
    plural: string;
  };
  spaceTerm: {
    singular: string;
    plural: string;
  };
  facilityDescriptor: string;
  defaultFacilities: string[];
  keyModules: NavItemKey[];
  defaultSampleOrgName: string;
  defaultSampleCity: string;
  accentColor: string;
  primaryAuditoriumName: string;
  targetAudience: string;
  sampleCustomFields: { label: string; placeholder: string }[];
}

export type BillingCycle = 'monthly' | 'annual';

export interface SubscriptionPlan {
  id: 'starter' | 'growth' | 'enterprise';
  name: string;
  tierTag: string;
  monthlyPrice: number;
  annualPrice: number;
  memberLimit: string;
  auditoriumLimit: string;
  spaceLimit: string;
  storage: string;
  features: string[];
  isPopular?: boolean;
  idealFor: string;
}

export interface OrganizationConfig {
  id: string;
  name: string;
  slug: string;
  sector: CommunitySector;
  memberTermSingular: string;
  memberTermPlural: string;
  spaceTermSingular: string;
  spaceTermPlural: string;
  city: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  accessPolicy: 'open' | 'approval_required' | 'domain_restricted';
  allowedDomain?: string;
  memberCountRange: string;
  enabledModules: NavItemKey[];
  subscription: {
    planId: 'starter' | 'growth' | 'enterprise';
    billingCycle: BillingCycle;
    amount: number;
    currency: string;
    status: 'active' | 'trial';
    startDate: string;
    nextBillingDate: string;
    paymentMethod: string;
  };
  primaryAdmin: {
    name: string;
    email: string;
    roleTitle: string;
    phone: string;
  };
}

export interface OnboardingFormState {
  // Step 1: Admin
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
  adminRoleTitle: string;

  // Step 2: Sector
  selectedSector: CommunitySector;

  // Step 3: Organization Details & Terminology
  orgName: string;
  orgSlug: string;
  city: string;
  country: string;
  memberCountRange: string;
  customMemberSingular: string;
  customMemberPlural: string;
  customSpaceSingular: string;
  customSpacePlural: string;
  accessPolicy: 'open' | 'approval_required' | 'domain_restricted';
  allowedDomain: string;

  // Step 4: Modules & Facilities
  enabledModules: NavItemKey[];
  primaryAuditoriumTitle: string;
  initialFacilityName: string;

  // Step 5: Subscription & Billing
  selectedPlanId: 'starter' | 'growth' | 'enterprise';
  billingCycle: BillingCycle;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  isTrial: boolean;
}
