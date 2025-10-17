import type { OnlineProfile, ServerEntry } from '../api-types';

export type PlayerProfile = OnlineProfile;

export function displayName(p: PlayerProfile): string {
  if (p.tagFormat && p.profileName) {
    const clan = p.shortName || '';
    return p.tagFormat.replace('C', clan).replace('P', p.profileName);
  }
  return p.profileName || 'Unknown';
}

/**
 * Parse clan tag and player name separately for styled rendering
 * Returns { clanTag, playerName } for separate display (like leaderboards)
 */
export function parseClanTag(p: PlayerProfile): { clanTag: string; playerName: string } {
  if (p.tagFormat && p.profileName && p.shortName) {
    // Extract clan tag portion by replacing player name with empty string
    const clanTag = p.tagFormat.replace('C', p.shortName).replace('P', '');
    return {
      clanTag: clanTag.trim(),
      playerName: p.profileName,
    };
  }
  return {
    clanTag: '',
    playerName: p.profileName || 'Unknown',
  };
}

/**
 * HTML-based colorizer compatible with <#hex>... </> markers
 * Validates hex colors to prevent malformed CSS injection
 */
export function colorize(name: string): string {
  let out = '<span style="color:#f3f6f8">';
  let last = 0;
  let open = false;
  const regex = /<#([\da-f]{3,6})>|<\/>/gi;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(name)) !== null) {
    out += name.slice(last, m.index);
    last = regex.lastIndex;

    if (m[1]) {
      // Validate hex color to prevent CSS injection
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
  return out + '</span>';
}

export type PlayerGroup = { serverId: string; serverName: string; players: PlayerProfile[] };

export function groupPlayersByServer(
  players: PlayerProfile[] = [],
  servers: ServerEntry[] = []
): PlayerGroup[] {
  const nameMap: Record<string, string> = {};
  for (const s of servers || []) nameMap[String(s.serverId)] = s.serverName;

  const map = new Map<string, PlayerGroup>();
  for (const p of players) {
    const sid = String(p.serverId ?? '?');
    // Server 0 means player is online but not on a server
    const sname = nameMap[sid] || (sid === '0' ? 'Online' : `Server ${sid}`);
    if (!map.has(sid)) map.set(sid, { serverId: sid, serverName: sname, players: [] });
    map.get(sid)!.players.push(p);
  }
  for (const g of map.values())
    g.players.sort((a, b) => displayName(a).localeCompare(displayName(b)));
  return Array.from(map.values()).sort((a, b) => a.serverName.localeCompare(b.serverName));
}
