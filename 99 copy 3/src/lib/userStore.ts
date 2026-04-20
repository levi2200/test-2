// ── USER IDENTITY & PARTNER SYSTEM ──────────────────────────────────────────
// Fully localStorage-based. No backend required.
// Users are identified by a persistent UUID generated on first visit.
// Partners are stored in a separate list, managed by admin.

export type UserPlan = 'free' | 'pro' | 'partner' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  plan: UserPlan;
  createdAt: string;
  usageCount: number;
}

export interface Partner {
  id: string;
  name: string;
  addedAt: string;
  note: string;
  accessCode: string;   // e.g. "RTHM-X7K2" — given to partner to self-unlock
}

// ── KEYS ─────────────────────────────────────────────────────────────────────
const KEY_USER    = 'rethumb_user';
const KEY_PARTNERS = 'rethumb_partners';

// ── UUID ─────────────────────────────────────────────────────────────────────
function generateId(): string {
  return 'u_' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

// ── ACCESS CODE ───────────────────────────────────────────────────────────────
// Generates a short human-friendly code like "RTHM-X7K2"
function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
  let part = '';
  for (let i = 0; i < 4; i++) part += chars[Math.floor(Math.random() * chars.length)];
  let part2 = '';
  for (let i = 0; i < 4; i++) part2 += chars[Math.floor(Math.random() * chars.length)];
  return `RTHM-${part}-${part2}`;
}

// ── CURRENT USER ─────────────────────────────────────────────────────────────
export function getUser(): UserProfile {
  try {
    const raw = localStorage.getItem(KEY_USER);
    if (raw) {
      const parsed = JSON.parse(raw) as UserProfile;
      // Migrate old usage from legacy key
      const legacyUsage = localStorage.getItem('rethumb_usage');
      const legacyPlan  = localStorage.getItem('rethumb_plan');
      if (legacyUsage !== null) {
        parsed.usageCount = parseInt(legacyUsage, 10) || parsed.usageCount;
        localStorage.removeItem('rethumb_usage');
      }
      if (legacyPlan === 'pro' && parsed.plan === 'free') {
        parsed.plan = 'pro';
        localStorage.removeItem('rethumb_plan');
      }
      saveUser(parsed);
      return parsed;
    }
  } catch { /* fallthrough */ }

  // First visit — create profile
  const user: UserProfile = {
    id: generateId(),
    name: '',
    plan: 'free',
    createdAt: new Date().toISOString(),
    usageCount: 0,
  };
  saveUser(user);
  return user;
}

export function saveUser(user: UserProfile): void {
  try {
    localStorage.setItem(KEY_USER, JSON.stringify(user));
  } catch { /* ignore */ }
}

export function setUserName(name: string): void {
  const user = getUser();
  user.name = name.trim();
  saveUser(user);
}

export function setUserPlan(plan: UserPlan): void {
  const user = getUser();
  user.plan = plan;
  saveUser(user);
}

// ── USAGE ─────────────────────────────────────────────────────────────────────
export function getUserUsage(): number {
  return getUser().usageCount;
}

export function incrementUserUsage(): number {
  const user = getUser();
  user.usageCount += 1;
  saveUser(user);
  return user.usageCount;
}

export function resetUserUsage(): void {
  const user = getUser();
  user.usageCount = 0;
  saveUser(user);
}

// ── PLAN CHECKS ───────────────────────────────────────────────────────────────
export function userHasUnlimitedAccess(): boolean {
  const plan = getUser().plan;
  return plan === 'pro' || plan === 'partner' || plan === 'admin';
}

export function userCanGenerate(limit: number): boolean {
  if (userHasUnlimitedAccess()) return true;
  return getUser().usageCount < limit;
}

// ── PARTNER LIST ──────────────────────────────────────────────────────────────
export function getPartners(): Partner[] {
  try {
    const raw = localStorage.getItem(KEY_PARTNERS);
    return raw ? (JSON.parse(raw) as Partner[]) : [];
  } catch {
    return [];
  }
}

function savePartners(partners: Partner[]): void {
  try {
    localStorage.setItem(KEY_PARTNERS, JSON.stringify(partners));
  } catch { /* ignore */ }
}

export function addPartner(name: string, note = ''): Partner {
  const partners = getPartners();
  const partner: Partner = {
    id: generateId(),
    name: name.trim(),
    note: note.trim(),
    addedAt: new Date().toISOString(),
    accessCode: generateAccessCode(),
  };
  partners.push(partner);
  savePartners(partners);
  return partner;
}

// ── REDEEM ACCESS CODE (partner self-unlock) ──────────────────────────────────
// Called on the partner's device. Checks their entered code against the admin's
// stored partner list. Returns true and upgrades plan on match.
export function redeemAccessCode(code: string): boolean {
  const normalised = code.trim().toUpperCase();
  const match = getPartners().find(p => p.accessCode === normalised);
  if (match) {
    setUserPlan('partner');
    return true;
  }
  return false;
}

export function removePartner(id: string): void {
  const partners = getPartners().filter(p => p.id !== id);
  savePartners(partners);
}

export function isCurrentUserPartner(): boolean {
  const user = getUser();
  return user.plan === 'partner' || user.plan === 'admin';
}

// ── ACTIVATE PARTNER ACCESS FOR CURRENT SESSION ───────────────────────────────
// Admin can flip current device to partner via admin panel
export function activatePartnerForCurrentUser(): void {
  setUserPlan('partner');
}

export function activateProForCurrentUser(): void {
  setUserPlan('pro');
}

export function resetCurrentUser(): void {
  const user = getUser();
  user.plan = 'free';
  user.usageCount = 0;
  saveUser(user);
}
