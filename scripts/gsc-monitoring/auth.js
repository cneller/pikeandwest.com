/**
 * Auth State Management for GSC Monitoring
 *
 * Handles saving/loading Playwright storage state with expiration checking.
 * Google sessions typically expire after ~24 hours.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

/**
 * Check if auth state file exists and is not expired
 * @param {string} stateFile - Path to state file
 * @param {number} expiryHours - Hours until expiration
 * @returns {{ valid: boolean, reason?: string }}
 */
export function checkAuthState(stateFile, expiryHours) {
  if (!existsSync(stateFile)) {
    return { valid: false, reason: 'State file does not exist' };
  }

  try {
    const stats = JSON.parse(readFileSync(stateFile, 'utf8'));

    // Check for metadata we add
    if (!stats._metadata?.savedAt) {
      return { valid: false, reason: 'State file missing metadata' };
    }

    const savedAt = new Date(stats._metadata.savedAt);
    const expiresAt = new Date(
      savedAt.getTime() + expiryHours * 60 * 60 * 1000
    );
    const now = new Date();

    if (now > expiresAt) {
      return {
        valid: false,
        reason: `State expired at ${expiresAt.toISOString()}`,
      };
    }

    const hoursRemaining = Math.round((expiresAt - now) / (60 * 60 * 1000));
    return {
      valid: true,
      reason: `State valid for ~${hoursRemaining} more hours`,
    };
  } catch (e) {
    return { valid: false, reason: `Error reading state: ${e.message}` };
  }
}

/**
 * Save storage state with metadata
 * @param {import('playwright').BrowserContext} context - Playwright context
 * @param {string} stateFile - Path to save state
 */
export async function saveAuthState(context, stateFile) {
  // Ensure directory exists
  const dir = dirname(stateFile);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  // Get storage state
  const state = await context.storageState();

  // Add metadata for expiration tracking
  state._metadata = {
    savedAt: new Date().toISOString(),
    version: 1,
  };

  writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

/**
 * Load storage state if valid
 * @param {string} stateFile - Path to state file
 * @param {number} expiryHours - Hours until expiration
 * @returns {object|null} - Storage state or null if invalid
 */
export function loadAuthState(stateFile, expiryHours) {
  const check = checkAuthState(stateFile, expiryHours);

  if (!check.valid) {
    return null;
  }

  const state = JSON.parse(readFileSync(stateFile, 'utf8'));

  // Remove our metadata before returning (Playwright doesn't expect it)
  delete state._metadata;

  return state;
}
