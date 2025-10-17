/**
 * Player Display Utility Composable
 *
 * Provides utilities for formatting and displaying player names, clan tags, and server groupings
 * with memoization for performance. Consolidates all player display logic from playerDisplay.ts.
 *
 * @example
 * ```typescript
 * const { colorize, parseClanTag, groupPlayersByServer } = usePlayerDisplay();
 *
 * // Colorize player name with in-game color codes
 * const html = colorize('<#ff0000>RedPlayer</>'); // Cached result
 *
 * // Parse clan tag and player name separately
 * const { clanTag, playerName } = parseClanTag(profile);
 *
 * // Group players by server
 * const groups = groupPlayersByServer(profiles, servers);
 * ```
 */

import type { OnlineProfile, ServerEntry } from '../api-types';

export type PlayerProfile = OnlineProfile;

export interface PlayerGroup {
  serverId: string;
  serverName: string;
  players: PlayerProfile[];
}

export interface ParsedPlayer {
  clanTag: string;
  playerName: string;
}

/**
 * Composable for player display operations with memoization
 */
export function usePlayerDisplay() {
  // Memoization cache for colorized names
  const colorizeCache = new Map<string, string>();

  /**
   * HTML-based colorizer compatible with <#hex>... </> markers
   * Validates hex colors to prevent malformed CSS injection.
   * Results are cached for performance.
   *
   * @param name - Player name with optional color markers
   * @returns HTML string with inline color styles
   *
   * @example
   * ```typescript
   * colorize('<#ff0000>Red</><#00ff00>Green</>');
   * // '<span style="color:var(--player-neutral)"><span style="color:#ff0000">Red</span><span style="color:#00ff00">Green</span></span>'
   * ```
   */
  function colorize(name: string): string {
    // Check cache first
    if (colorizeCache.has(name)) {
      return colorizeCache.get(name)!;
    }

    let out = '<span style="color:#f3f6f8">';
    let last = 0;
    let open = false;
    const regex = /<#([\da-f]{3,6})>|<\/>/gi;
    let m: RegExpExecArray | null;

    while ((m = regex.exec(name)) !== null) {
      out += name.slice(last, m.index);
      last = regex.lastIndex;

      if (m[1]) {
        // Security: Strict hex validation prevents CSS injection
        // Only allows valid hex colors (3-6 characters, alphanumeric)
        // For user-generated content, add DOMPurify sanitization (see docs/security.md)
        const hexColor = m[1];
        if (/^[\da-f]{3,6}$/i.test(hexColor)) {
          if (open) out += '</span>';
          out += `<span style="color:#${hexColor}">`;
          open = true;
        }
      } else if (open) {
        out += '</span>';
        open = false;
      }
    }

    out += name.slice(last);
    if (open) out += '</span>';
    const result = out + '</span>';

    // Cache the result
    colorizeCache.set(name, result);

    return result;
  }

  /**
   * Format player display name with clan tag
   * Returns full formatted string (used for sorting and basic display)
   *
   * @param profile - Player profile object
   * @returns Formatted display name
   *
   * @example
   * ```typescript
   * displayName({ tagFormat: '[C]P', shortName: 'TAG', profileName: 'Player' });
   * // '[TAG]Player'
   * ```
   */
  function displayName(profile: PlayerProfile): string {
    if (profile.tagFormat && profile.profileName) {
      const clan = profile.shortName || '';
      return profile.tagFormat.replace('C', clan).replace('P', profile.profileName);
    }
    return profile.profileName || 'Unknown';
  }

  /**
   * Parse clan tag and player name separately for styled rendering
   * Returns object with separate clan tag and player name for custom styling
   *
   * @param profile - Player profile object
   * @returns Object with clanTag and playerName properties
   *
   * @example
   * ```typescript
   * parseClanTag({ tagFormat: '[C]P', shortName: 'TAG', profileName: 'Player' });
   * // { clanTag: '[TAG]', playerName: 'Player' }
   * ```
   */
  function parseClanTag(profile: PlayerProfile): ParsedPlayer {
    if (profile.tagFormat && profile.profileName && profile.shortName) {
      // Extract clan tag portion by replacing player name with empty string
      const clanTag = profile.tagFormat.replace('C', profile.shortName).replace('P', '');
      return {
        clanTag: clanTag.trim(),
        playerName: profile.profileName,
      };
    }
    return {
      clanTag: '',
      playerName: profile.profileName || 'Unknown',
    };
  }

  /**
   * Group players by server with optimized sorting
   *
   * @param players - Array of online player profiles
   * @param servers - Array of server entries
   * @returns Array of PlayerGroup objects sorted by server name
   *
   * @example
   * ```typescript
   * const groups = groupPlayersByServer(profiles, servers);
   * // [{ serverId: '1', serverName: 'EU Main', players: [...] }]
   * ```
   */
  function groupPlayersByServer(
    players: PlayerProfile[] = [],
    servers: ServerEntry[] = []
  ): PlayerGroup[] {
    // Build server name lookup map
    const nameMap: Record<string, string> = {};
    for (const s of servers || []) {
      nameMap[String(s.serverId)] = s.serverName;
    }

    // Group players by server
    const map = new Map<string, PlayerGroup>();
    for (const p of players) {
      const sid = String(p.serverId ?? '?');
      // Server 0 means player is online but not on a server
      const sname = nameMap[sid] || (sid === '0' ? 'Online' : `Server ${sid}`);

      if (!map.has(sid)) {
        map.set(sid, { serverId: sid, serverName: sname, players: [] });
      }

      const group = map.get(sid);
      if (group) {
        group.players.push(p);
      }
    }

    // Sort players within each group alphabetically
    for (const g of map.values()) {
      g.players.sort((a, b) => displayName(a).localeCompare(displayName(b)));
    }

    // Return groups sorted by server name
    return Array.from(map.values()).sort((a, b) => a.serverName.localeCompare(b.serverName));
  }

  /**
   * Clear the colorize cache
   * Call this when player data refreshes to prevent memory leaks
   *
   * @example
   * ```typescript
   * // After API refresh
   * clearColorizeCache();
   * ```
   */
  function clearColorizeCache(): void {
    colorizeCache.clear();
  }

  /**
   * Get cache statistics (useful for debugging/monitoring)
   *
   * @returns Object with cache size
   */
  function getCacheStats() {
    return {
      colorizeSize: colorizeCache.size,
    };
  }

  return {
    colorize,
    displayName,
    parseClanTag,
    groupPlayersByServer,
    clearColorizeCache,
    getCacheStats,
  };
}
