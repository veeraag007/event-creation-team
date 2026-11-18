import React, { useCallback, useEffect, useState } from 'react';
import { LoginView } from './LoginView';
import { OnboardingWizardModal } from './OnboardingWizardModal';
import { Role, UserProfile } from '../types';
import { CommunitySector, OrganizationConfig } from '../types/onboarding';
import { ROLE_CONFIGS } from '../data/rolePermissions';
import { clearSession, loadSession, saveSession } from './session';

export interface AuthContextValue {
  user: UserProfile;
  organization: OrganizationConfig;
  logout: () => void;
  switchRole: (role: Role) => void;
  switchOrganization: (org: OrganizationConfig) => void;
  openOnboarding: () => void;
}

interface AuthGateProps {
  /** Micro-app name shown on the login screen (e.g. "Event Creation"). */
  appName: string;
  children: (auth: AuthContextValue) => React.ReactNode;
  onToast?: (message: string) => void;
}

const initials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2);

/**
 * Login boundary shared by every micro-app. Renders the login / onboarding
 * screen until a session exists, then hands the signed-in user to the app.
 */
export const AuthGate: React.FC<AuthGateProps> = ({ appName, children, onToast }) => {
  const [session, setSession] = useState(loadSession);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingSector, setOnboardingSector] = useState<CommunitySector>('professional-business');

  useEffect(() => {
    if (session) saveSession(session);
  }, [session]);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const handleComplete = (org: OrganizationConfig) => {
    setSession({
      organization: org,
      profile: {
        id: `usr-${Date.now()}`,
        name: org.primaryAdmin.name,
        email: org.primaryAdmin.email,
        role: 'Super Admin',
        community: org.name,
        avatar: initials(org.primaryAdmin.name)
      }
    });
    setIsOnboardingOpen(false);
    onToast?.(`Successfully onboarded ${org.name}!`);
  };

  if (!session) {
    return (
      <>
        <LoginView
          appName={appName}
          onLogin={(profile, org) => {
            if (!org) return;
            setSession({ profile, organization: org });
          }}
          onOpenOnboarding={(sector) => {
            if (sector) setOnboardingSector(sector);
            setIsOnboardingOpen(true);
          }}
        />
        {isOnboardingOpen && (
          <OnboardingWizardModal
            isOpen={isOnboardingOpen}
            onClose={() => setIsOnboardingOpen(false)}
            onComplete={handleComplete}
            initialSector={onboardingSector}
          />
        )}
      </>
    );
  }

  const auth: AuthContextValue = {
    user: session.profile,
    organization: session.organization,
    logout,
    openOnboarding: () => setIsOnboardingOpen(true),
    switchRole: (role) => {
      const cfg = ROLE_CONFIGS[role];
      setSession(prev => prev && ({
        ...prev,
        profile: { ...prev.profile, role, name: cfg.personaName, avatar: cfg.avatarInitials }
      }));
      onToast?.(`Switched active persona to: ${cfg.personaName} (${role})`);
    },
    switchOrganization: (org) => {
      setSession(prev => prev && ({
        organization: org,
        profile: {
          ...prev.profile,
          name: org.primaryAdmin.name,
          email: org.primaryAdmin.email,
          community: org.name,
          avatar: initials(org.primaryAdmin.name)
        }
      }));
      onToast?.(`Switched active organization to: ${org.name}`);
    }
  };

  return (
    <>
      {children(auth)}
      {isOnboardingOpen && (
        <OnboardingWizardModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onComplete={handleComplete}
          initialSector={onboardingSector}
        />
      )}
    </>
  );
};
