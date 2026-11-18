import { UserProfile } from '../types';
import { OrganizationConfig } from '../types/onboarding';

export interface Session {
  profile: UserProfile;
  organization: OrganizationConfig;
}

const SESSION_KEY = 'community.session.v1';

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* storage unavailable – session lives in memory only */
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
