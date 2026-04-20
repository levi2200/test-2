// ── USAGE SHIM ────────────────────────────────────────────────────────────────
// All logic now lives in userStore.ts
// This file stays for backward-compat imports across the app.

import {
  getUserUsage,
  incrementUserUsage,
  userHasUnlimitedAccess,
  userCanGenerate,
  activateProForCurrentUser,
  resetCurrentUser,
} from './userStore';

export const FREE_LIMIT_CONST = 3;

export function getUsageCount(): number {
  return getUserUsage();
}

export function incrementUsage(): number {
  return incrementUserUsage();
}

export function hasProAccess(): boolean {
  return userHasUnlimitedAccess();
}

export function setProAccess(): void {
  activateProForCurrentUser();
}

export function canGenerate(): boolean {
  return userCanGenerate(FREE_LIMIT_CONST);
}

export function remainingFree(): number {
  if (userHasUnlimitedAccess()) return Infinity;
  return Math.max(0, FREE_LIMIT_CONST - getUserUsage());
}

export function resetAccess(): void {
  resetCurrentUser();
}
